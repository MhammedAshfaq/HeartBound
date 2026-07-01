import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'User phone number in E.164 format',
    example: '+919999999999',
  })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({
    description: 'ISO country code',
    example: 'IN',
  })
  @IsNotEmpty()
  @IsString()
  isoCode!: string;
}
