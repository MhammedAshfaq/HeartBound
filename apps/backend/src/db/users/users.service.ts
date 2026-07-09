import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as schema from '../schema';
import * as crypto from 'crypto';

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

  async findByAppCode(appCode: string) {
    return this.usersRepository.findByAppCode(appCode);
  }

  async generateUniqueAppCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let isUnique = false;
    let code = '';
    
    while (!isUnique) {
      code = '';
      const randomBytes = crypto.randomBytes(8);
      for (let i = 0; i < 8; i++) {
        code += chars[randomBytes[i] % chars.length];
      }
      
      const existing = await this.findByAppCode(code);
      if (!existing) {
        isUnique = true;
      }
    }
    
    return code;
  }

  async create(user: typeof schema.users.$inferInsert) {
    if (!user.appCode) {
      user.appCode = await this.generateUniqueAppCode();
    }
    return this.usersRepository.create(user);
  }

  async update(id: string, user: Partial<typeof schema.users.$inferInsert>) {
    return this.usersRepository.update(id, user);
  }

  async createLog(logData: typeof schema.userLogs.$inferInsert) {
    return this.usersRepository.createLog(logData);
  }

  async findLogsByUserId(userId: string, limit: number, offset: number) {
    return this.usersRepository.findLogsByUserId(userId, limit, offset);
  }

  async findActivePartnership(userId: string) {
    return this.usersRepository.findActivePartnership(userId);
  }

  async linkPartner(userId: string, partnerId: string) {
    return this.usersRepository.linkPartner(userId, partnerId);
  }

  async unsyncPartner(userId: string) {
    return this.usersRepository.unsyncPartner(userId);
  }
}
