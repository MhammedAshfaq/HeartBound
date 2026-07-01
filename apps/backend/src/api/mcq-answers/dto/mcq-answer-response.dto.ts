import { ApiProperty } from '@nestjs/swagger';

export class McqResponseItemDto {
  @ApiProperty({
    description: 'Identifier of the MCQ question',
    example: 'q_communication_01',
  })
  questionId!: string;

  @ApiProperty({
    description: 'Answer selected / provided by the user',
    example: 'strongly_agree',
  })
  answer!: string;
}

export class McqAnswerDto {
  @ApiProperty({
    description: 'Unique identifier of the MCQ answer record',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id!: string;

  @ApiProperty({
    description: 'UUID of the user who submitted these answers',
    format: 'uuid',
    example: 'cdec17e0-f9f4-48c1-859e-060b97de3eb5',
  })
  userId!: string;

  @ApiProperty({
    description: 'Array of question-answer pairs stored in JSONB',
    type: [McqResponseItemDto],
  })
  responses!: McqResponseItemDto[];

  @ApiProperty({ description: 'Record creation timestamp' })
  createdAt!: Date;

  @ApiProperty({ description: 'Record last-updated timestamp' })
  updatedAt!: Date;
}
