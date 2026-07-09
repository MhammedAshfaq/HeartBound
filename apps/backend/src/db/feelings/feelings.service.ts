import { Injectable } from '@nestjs/common';
import { FeelingsRepository } from './feelings.repository';
import * as schema from '../schema';

@Injectable()
export class FeelingsDbService {
  constructor(private readonly feelingsRepository: FeelingsRepository) {}

  async findTodayByUserId(userId: string) {
    return this.feelingsRepository.findTodayByUserId(userId);
  }

  async create(data: typeof schema.feelings.$inferInsert) {
    return this.feelingsRepository.create(data);
  }
}
