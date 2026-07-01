import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as schema from '../schema';

@Injectable()
export class UsersDbService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findByPhone(phone: string, country: string) {
    return this.usersRepository.findByPhone(phone, country);
  }

  async findByOAuthProviderId(provider: 'google' | 'apple' | 'facebook', providerId: string) {
    return this.usersRepository.findByOAuthProviderId(provider, providerId);
  }

  async create(user: typeof schema.users.$inferInsert) {
    return this.usersRepository.create(user);
  }

  async update(id: string, user: Partial<typeof schema.users.$inferInsert>) {
    return this.usersRepository.update(id, user);
  }
}
