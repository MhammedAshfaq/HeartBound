import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/send')
  @ApiOperation({ summary: 'Request an OTP verification SMS' })
  @ApiResponse({ status: 200, description: 'SMS request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Unsupported or invalid country code' })
  async sendOtp(@Body() body: SendOtpDto) {
    return this.authService.generateAndSendOtp(body);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify 6-digit OTP code and retrieve session token' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated, session details returned' })
  @ApiResponse({ status: 400, description: 'Expired or invalid code' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtpAndLogin(
      body
    );
  }

  @Post('oauth')
  @ApiOperation({ summary: 'Authenticate / Register via Google, Apple, or Facebook' })
  @ApiResponse({ status: 200, description: 'OAuth signature verified, session details returned' })
  async loginWithOAuth(@Body() body: OAuthLoginDto) {
    return this.authService.loginWithOAuth(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: 'Update user profile metadata (onboarding details)' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.id, body);
  }
}
