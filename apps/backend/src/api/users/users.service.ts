import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // Resolve partnership details dynamically
    const partnership = await this.usersDbService.findActivePartnership(userId);
    let partnerDetails: {
      partnerId: string | null;
      partnerName: string | null;
      partnerDob: string | null;
      partnerEmail: string | null;
      partnerCode: string | null;
    } = {
      partnerId: null,
      partnerName: user.partnerName,
      partnerDob: user.partnerDob,
      partnerEmail: null,
      partnerCode: null,
    };

    if (partnership) {
      const partnerId = partnership.userId === userId ? partnership.partnerId : partnership.userId;
      const partnerUser = await this.usersDbService.findById(partnerId);
      if (partnerUser) {
        partnerDetails = {
          partnerId: partnerUser.id,
          partnerName: partnerUser.name,
          partnerDob: partnerUser.dateOfBirth,
          partnerEmail: partnerUser.email,
          partnerCode: partnerUser.appCode,
        };
      }
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
      partnerName: partnerDetails.partnerName,
      anniversaryDate: user.anniversaryDate,
      partnerDob: partnerDetails.partnerDob,
      partnerEmail: partnerDetails.partnerEmail,
      partnerCode: partnerDetails.partnerCode,
      partnerId: partnerDetails.partnerId,
      appCode: user.appCode,
      theme: user.theme,
      isNotificationsEnabled: user.isNotificationsEnabled,
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
      'partnerName',
      'anniversaryDate',
      'partnerDob',
      'appCode',
      'theme',
      'isNotificationsEnabled',
      'profileCompleter',
    ];

    for (const key of allowedKeys) {
      if (dto[key] !== undefined) {
        (updatePayload as any)[key] = dto[key];
      }
    }

    const updatedUser = await this.usersDbService.update(userId, updatePayload);

    // Process partnerCode sync/unsync if provided
    if (dto.partnerCode !== undefined) {
      if (dto.partnerCode === '') {
        await this.usersDbService.unsyncPartner(userId);
      } else {
        const partnerUser = await this.usersDbService.findByAppCode(dto.partnerCode);
        if (!partnerUser) {
          throw new NotFoundException('Partner with this code not found');
        }
        if (partnerUser.id === userId) {
          throw new BadRequestException('You cannot sync with yourself');
        }
        await this.usersDbService.linkPartner(userId, partnerUser.id);
      }
    }

    const previous: Record<string, any> = {};
    const current: Record<string, any> = {};
    for (const key in updatePayload) {
      if ((user as any)[key] !== (updatePayload as any)[key]) {
        previous[key] = (user as any)[key];
        current[key] = (updatePayload as any)[key];
      }
    }

    if (dto.partnerCode !== undefined) {
      current.partnerCode = dto.partnerCode;
    }

    if (Object.keys(current).length > 0) {
      let action = 'UPDATE_PROFILE';
      if (current.relationshipStatus) {
        action = 'UPDATE_RELATIONSHIP_STATUS';
      }
      
      await this.usersDbService.createLog({
        userId,
        action,
        metadata: { previous, current }
      });
    }

    return this.getProfile(userId);
  }

  async getUserLogs(userId: string, limit: number, offset: number) {
    return this.usersDbService.findLogsByUserId(userId, limit, offset);
  }
}
