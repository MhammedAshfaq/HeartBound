import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates both access and refresh tokens for a user session
   */
  generateTokens(userId: string, email: string, phone?: string) {
    const payload = { email, sub: userId, phone };
    const secret = process.env.JWT_SECRET || 'superSecretKey_heartbond_secure_2026_xYz';
    return {
      accessToken: this.jwtService.sign(payload, {
        secret,
        expiresIn: process.env.JWT_ACCESS_EXPIRY || '7d',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret,
        expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d',
      }),
    };
  }

  /**
   * Verifies a JWT token signature and expiration
   */
  verifyToken(token: string) {
    const secret = process.env.JWT_SECRET || 'superSecretKey_heartbond_secure_2026_xYz';
    return this.jwtService.verify(token, { secret });
  }

  /**
   * Decodes a JWT token without validating the signature
   */
  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }
}
