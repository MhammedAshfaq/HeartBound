import { Injectable } from '@nestjs/common';
import { McqAnswersRepository } from './mcq-answers.repository';
import * as schema from '../schema';

@Injectable()
export class McqAnswersDbService {
  constructor(private readonly mcqAnswersRepository: McqAnswersRepository) {}

  async findAllByUserId(userId: string) {
    return this.mcqAnswersRepository.findAllByUserId(userId);
  }

  async create(data: typeof schema.mcqAnswers.$inferInsert) {
    return this.mcqAnswersRepository.create(data);
  }
}
