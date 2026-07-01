import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum RelationshipStatus {
  SINGLE = 'single',
  DATING = 'dating',
  ENGAGED = 'engaged',
  MARRIED = 'married'
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Full display name of the user', example: 'John Doe', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: 'Email address of the user', example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Public avatar/profile picture URL', example: 'https://cdn.example.com/avatars/john.jpg', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar?: string;

  @ApiPropertyOptional({ description: 'Date of birth in ISO 8601 format', example: '1995-06-15' })
  @IsOptional()
  @IsISO8601()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Gender identity', example: 'male', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  gender?: string;

  @ApiPropertyOptional({
    description: 'Current relationship status',
    enum: RelationshipStatus,
    example: RelationshipStatus.DATING,
  })
  @IsOptional()
  @IsEnum(RelationshipStatus)
  relationshipStatus?: RelationshipStatus;

  @ApiPropertyOptional({ description: 'UUID or identifier of the linked partner user', example: 'cdec17e0-f9f4-48c1-859e-060b97de3eb5', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  partnerId?: string;

  @ApiPropertyOptional({ description: "Partner's display name", example: 'Jane Doe', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  partnerName?: string;

  @ApiPropertyOptional({ description: 'Relationship anniversary date in ISO 8601 format', example: '2020-02-14' })
  @IsOptional()
  @IsISO8601()
  anniversaryDate?: string;

  @ApiPropertyOptional({ description: "Partner's date of birth in ISO 8601 format", example: '1997-03-22' })
  @IsOptional()
  @IsISO8601()
  partnerDob?: string;

  @ApiPropertyOptional({ description: "Partner's email address", example: 'jane@example.com' })
  @IsOptional()
  @IsEmail()
  partnerEmail?: string;

  @ApiPropertyOptional({ description: 'Short invite/referral code to link with a partner', example: 'JDOE2024', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  partnerCode?: string;

  @ApiPropertyOptional({ description: 'Set to true once the user has completed the onboarding profile + MCQ flow', example: true })
  @IsOptional()
  @IsBoolean()
  profileCompleter?: boolean;
}
