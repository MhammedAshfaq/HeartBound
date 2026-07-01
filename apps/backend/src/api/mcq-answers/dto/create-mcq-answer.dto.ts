import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class McqResponseItemDto {
  @ApiProperty({
    description: 'Identifier of the MCQ question',
    example: 'q_communication_01',
  })
  @IsString()
  questionId!: string;

  @ApiProperty({
    description: 'Answer selected / provided by the user',
    example: 'strongly_agree',
  })
  @IsString()
  answer!: string;
}

export class CreateMcqAnswerDto {
  @ApiProperty({
    description: 'UUID of the user submitting the MCQ answers',
    format: 'uuid',
    example: 'cdec17e0-f9f4-48c1-859e-060b97de3eb5',
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    description: 'Array of question-answer pairs to persist in JSONB',
    type: [McqResponseItemDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => McqResponseItemDto)
  responses!: McqResponseItemDto[];
}
