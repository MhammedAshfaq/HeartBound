import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class OAuthLoginDto {
  @ApiProperty({
    description: 'OAuth provider name',
    enum: ['google', 'apple', 'facebook'],
    example: 'google',
  })
  @IsNotEmpty()
  @IsIn(['google', 'apple', 'facebook'])
  provider!: 'google' | 'apple' | 'facebook';

  @ApiProperty({
    description: 'OAuth identity access/ID token',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiPropertyOptional({
    description: 'OAuth email address profile override',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'OAuth display name profile override',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
