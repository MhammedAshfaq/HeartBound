import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersDbService } from '../../db/users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersDbService: UsersDbService) {}

  async getProfile(userId: string) {
    const user = await this.usersDbService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      country: user.country,
      avatar: user.avatar,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      relationshipStatus: user.relationshipStatus,
      partnerId: user.partnerId,
      partnerName: user.partnerName,
      anniversaryDate: user.anniversaryDate,
      partnerDob: user.partnerDob,
      partnerEmail: user.partnerEmail,
      partnerCode: user.partnerCode,
      profileCompleter: user.profileCompleter,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersDbService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Only include fields that are explicitly passed in the DTO
    const updatePayload: Partial<UpdateProfileDto> = {};
    const allowedKeys: (keyof UpdateProfileDto)[] = [
      'name',
      'email',
      'avatar',
      'dateOfBirth',
      'gender',
      'relationshipStatus',
      'partnerId',
      'partnerName',
      'anniversaryDate',
      'partnerDob',
      'partnerEmail',
      'partnerCode',
      'profileCompleter',
    ];

    for (const key of allowedKeys) {
      if (dto[key] !== undefined) {
        (updatePayload as any)[key] = dto[key];
      }
    }

    const updatedUser = await this.usersDbService.update(userId, updatePayload);
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      country: updatedUser.country,
      avatar: updatedUser.avatar,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      relationshipStatus: updatedUser.relationshipStatus,
      partnerId: updatedUser.partnerId,
      partnerName: updatedUser.partnerName,
      anniversaryDate: updatedUser.anniversaryDate,
      partnerDob: updatedUser.partnerDob,
      partnerEmail: updatedUser.partnerEmail,
      partnerCode: updatedUser.partnerCode,
      profileCompleter: updatedUser.profileCompleter,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
