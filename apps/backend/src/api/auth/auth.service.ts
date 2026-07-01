import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { CacheService } from '@redis/cache.service';
import { UsersDbService } from '../../db/users/users.service';
import { SmsService } from '../../sms/sms.service';
import { CountriesDbService } from '../../db/countries/countries.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MASTER_OTP = process.env.TWILIO_MASTER_OTP || '009832';

  constructor(
    private readonly usersDbService: UsersDbService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly cacheService: CacheService,
    private readonly smsService: SmsService,
    private readonly countriesDbService: CountriesDbService,
  ) {}

  async generateAndSendOtp(body: SendOtpDto) {
    try {
      const country = await this.countriesDbService.getByIsoCode(body.isoCode);

      if (!country) {
        throw new BadRequestException(`Country code "${body.isoCode}" is not supported or active.`);
      }

      const isProd = process.env.NODE_SERVER === 'prod';

      if (isProd) {
        // PRODUCTION: Generate real 6-digit code, store in Redis, fire Twilio SMS
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.cacheService.set(`otp:${body.phone}`, code, 120);
        const smsBody = `Your HeartBound verification code is: ${code}. It is valid for 120 seconds`;
        await this.smsService.sendSms(body.phone, smsBody);
        this.logger.log(`[AUTH][PROD] OTP sent via Twilio for ${body.phone}`);
        return {
          success: true,
          message: 'OTP sent successfully',
        };
      } else {
        // DEVELOPMENT: Skip Twilio — use the master OTP from .env (TWILIO_MASTER_OTP)
        this.logger.log(`[AUTH][DEV] Skipping Twilio. Use master OTP "${this.MASTER_OTP}" for ${body.phone}`);
        return {
          success: true,
          message: 'OTP sent successfully (dev mode — use master OTP)',
          dev_otp: this.MASTER_OTP,
        };
      }
    } catch (error: any) {
      this.logger.error(`Failed to generate or send OTP for phone ${body.phone}:`, error);
      throw new BadRequestException(
        error.message || 'Failed to generate and send OTP verification code',
      );
    }
  }

  async verifyOtpAndLogin(
    body: VerifyOtpDto,
  ) {
    this.logger.log(`[AUTH] Verifying OTP code *** for phone ${body.phone}`);

    const countryData = await this.countriesDbService.getByIsoCode(body.isoCode);
    
    if (!countryData) {
      throw new BadRequestException('Country code is not supported or active.');
    }
    // 1. Fetch OTP from Redis (only meaningful in prod — dev always uses master OTP)
    const cachedCode = await this.cacheService.get<string>(`otp:${body.phone}`);
    const isProd = process.env.NODE_SERVER === 'prod';

    if (isProd) {
      // PRODUCTION: validate against the real cached OTP only
      if (!cachedCode || cachedCode !== body.code) {
        throw new BadRequestException('Invalid or expired verification code');
      }
    } else {
      // DEVELOPMENT: accept either the master OTP or the cached code
      const isMasterOtp = body.code === this.MASTER_OTP;
      const isValidCached = !!cachedCode && cachedCode === body.code;
      if (!isMasterOtp && !isValidCached) {
        throw new BadRequestException('Invalid or expired verification code');
      }
    }

    // 2. Clear OTP cache
    try {
      await this.cacheService.set(`otp:${body.phone}`, null, 1);
    } catch (e) {
      this.logger.warn(`Failed to clear OTP cache for key "otp:${body.phone}"`);
    }

    // 3. Find or Create User
    let user = await this.usersDbService.findByPhone(body.phone, countryData.name);
    if (!user) {
      user = await this.usersDbService.create({
        phone: body.phone,
        country: countryData.name,
      });
    }

    // 4. Generate Session tokens
    const tokens = this.generateTokens(user.id, user.email || '', user.phone || undefined);

    return {
      success: true,
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        relationshipStatus: user.relationshipStatus,
        partnerId: user.partnerId,
        partnerName: user.partnerName,
        anniversaryDate: user.anniversaryDate,
        partnerDob: user.partnerDob,
        partnerEmail: user.partnerEmail,
        partnerCode: user.partnerCode,
        profileCompleter: user.profileCompleter,
      },
    };
  }

  async loginWithOAuth(dto: {
    provider: 'google' | 'apple' | 'facebook';
    token: string;
    email?: string;
    name?: string;
  }) {
    const { provider, token } = dto;
    let providerId: string;
    let resolvedEmail = dto.email;
    let resolvedName = dto.name;
    let resolvedAvatar: string | undefined;

    // A. Check if it is a developer mock token (bypass API verification)
    if (token === 'google-mock-token' || token.startsWith('mock-') || token === 'google') {
      providerId = `oauth_${provider}_${token.substring(0, 12)}`;
      resolvedEmail = resolvedEmail || `${providerId}@example.com`;
      resolvedName = resolvedName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
    } else {
      // B. Real verification
      if (provider === 'google') {
        try {
          const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
          if (res.status !== 200) {
            const errText = await res.text();
            this.logger.error(`Google token validation failed: ${errText}`);
            throw new BadRequestException('Invalid or expired Google OAuth token');
          }
          const payload = await res.json();
          providerId = payload.sub;
          resolvedEmail = payload.email;
          resolvedName = payload.name;
          resolvedAvatar = payload.picture;
        } catch (error) {
          this.logger.error('Error verifying Google Token:', error);
          if (error instanceof BadRequestException) throw error;
          throw new BadRequestException('Failed to verify Google OAuth token');
        }
      } else {
        // Fallback for other providers not fully configured with verification APIs yet
        providerId = `oauth_${provider}_${token.substring(0, 12)}`;
        resolvedEmail = resolvedEmail || `${providerId}@example.com`;
        resolvedName = resolvedName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
      }
    }

    // 1. Try to find user by providerId
    let user = await this.usersDbService.findByOAuthProviderId(provider, providerId);
    
    // 2. If not found by provider ID, try to find by email
    if (!user && resolvedEmail) {
      user = await this.usersDbService.findByEmail(resolvedEmail);
      if (user) {
        // Link provider ID to existing user
        const updateData: any = {};
        if (provider === 'google') updateData.googleId = providerId;
        else if (provider === 'apple') updateData.appleId = providerId;
        else if (provider === 'facebook') updateData.facebookId = providerId;
        
        if (resolvedAvatar && !user.avatar) {
          updateData.avatar = resolvedAvatar;
        }
        user = await this.usersDbService.update(user.id, updateData);
      }
    }

    // 3. If still not found, create new user
    if (!user) {
      const createData: any = {
        email: resolvedEmail || `${providerId}@example.com`,
        name: resolvedName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatar: resolvedAvatar,
      };
      if (provider === 'google') createData.googleId = providerId;
      else if (provider === 'apple') createData.appleId = providerId;
      else if (provider === 'facebook') createData.facebookId = providerId;

      user = await this.usersDbService.create(createData);
    }

    // 4. Generate Session tokens
    const tokens = this.generateTokens(user.id, user.email || '', user.phone || undefined);

    return {
      success: true,
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        relationshipStatus: user.relationshipStatus,
        partnerId: user.partnerId,
        partnerName: user.partnerName,
        anniversaryDate: user.anniversaryDate,
        partnerDob: user.partnerDob,
        partnerEmail: user.partnerEmail,
        partnerCode: user.partnerCode,
        profileCompleter: user.profileCompleter,
      },
    };
  }

  async updateProfile(userId: string, dto: any) {
    // 1. Sanitize the payload to only update defined columns
    const allowedKeys = [
      'name',
      'email',
      'avatar',
      'dateOfBirth',
      'gender',
      'relationshipStatus',
      'partnerId',
      'partnerName',
      'anniversaryDate',
      'partnerDob',
      'partnerEmail',
      'partnerCode',
      'profileCompleter',
    ];

    const updatePayload: any = {};
    for (const key of allowedKeys) {
      if (dto[key] !== undefined) {
        updatePayload[key] = dto[key];
      }
    }

    // 2. Perform DB update
    const updatedUser = await this.usersDbService.update(userId, updatePayload);

    return {
      success: true,
      user: updatedUser,
    };
  }

  private generateTokens(userId: string, email: string, phone?: string) {
    return this.jwtTokenService.generateTokens(userId, email, phone);
  }
}
