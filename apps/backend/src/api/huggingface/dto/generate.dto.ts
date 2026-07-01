import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GenerateDto {
  @ApiProperty({
    description: 'Prompt to generate text',
    example: 'What is the meaning of life?',
  })
  @IsString()
  prompt!: string;

  @ApiPropertyOptional({
    description: 'Model to generate text',
    example: 'gpt2',
  })
  @IsOptional()
  @IsString()
  model?: string;
}