import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'User phone number in E.164 format',
    example: '+919999999999',
  })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({
    description: '6-digit verification code',
    example: '009832',
  })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({
    description: 'ISO country code',
    example: 'IN',
  })
  @IsNotEmpty()
  @IsString()
  isoCode!: string;
}
