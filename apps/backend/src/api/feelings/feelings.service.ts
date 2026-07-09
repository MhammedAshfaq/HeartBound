import { Injectable, ConflictException } from '@nestjs/common';
import { FeelingsDbService } from '../../db/feelings/feelings.service';
import { CreateFeelingDto } from './dto/create-feeling.dto';

@Injectable()
export class FeelingsService {
  constructor(private readonly feelingsDbService: FeelingsDbService) {}

  async create(userId: string, createFeelingDto: CreateFeelingDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingFeeling = await this.feelingsDbService.findTodayByUserId(userId);

    if (existingFeeling) {
      throw new ConflictException('You have already submitted your feeling for today.');
    }

    return this.feelingsDbService.create({
      userId,
      emoji: createFeelingDto.emoji,
      note: createFeelingDto.note,
    });
  }

  async findToday(userId: string) {
    return this.feelingsDbService.findTodayByUserId(userId);
  }
}
