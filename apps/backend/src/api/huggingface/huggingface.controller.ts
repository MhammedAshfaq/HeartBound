import { Body, Controller, Post } from '@nestjs/common';
import { HuggingFaceService } from './huggingface.service';
import { GenerateDto } from './dto/generate.dto';

@Controller('ai')
export class HuggingFaceController {
  constructor(private readonly hfService: HuggingFaceService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateDto) {
    return this.hfService.generateText(dto.prompt, dto.model);
  }
}