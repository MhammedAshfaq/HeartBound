import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeelingDto {
  @IsString()
  @IsNotEmpty()
  emoji!: string;

  @IsString()
  @IsOptional()
  note?: string;
}
