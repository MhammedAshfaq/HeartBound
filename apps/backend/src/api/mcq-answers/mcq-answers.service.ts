import { Injectable, NotFoundException } from '@nestjs/common';
import { McqAnswersDbService } from '../../db/mcq-answers/mcq-answers.service';
import { UsersDbService } from '../../db/users/users.service';
import { CreateMcqAnswerDto } from './dto/create-mcq-answer.dto';

@Injectable()
export class McqAnswersService {
  constructor(
    private readonly mcqAnswersDbService: McqAnswersDbService,
    private readonly usersDbService: UsersDbService,
  ) {}

  /**
   * Returns all MCQ answer records belonging to the given user.
   * Throws 404 if the user does not exist.
   */
  async findAllByUserId(userId: string) {
    const user = await this.usersDbService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    const records = await this.mcqAnswersDbService.findAllByUserId(userId);

    return records.map((record) => ({
      id: record.id,
      userId: record.userId,
      responses: record.responses,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  }

  /**
   * Creates a new MCQ answer record for the given user.
   * Throws 404 if the user does not exist.
   */
  async create(dto: CreateMcqAnswerDto) {
    const user = await this.usersDbService.findById(dto.userId);
    if (!user) {
      throw new NotFoundException(`User with id "${dto.userId}" not found`);
    }

    const record = await this.mcqAnswersDbService.create({
      userId: dto.userId,
      responses: dto.responses,
    });

    return {
      id: record.id,
      userId: record.userId,
      responses: record.responses,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
