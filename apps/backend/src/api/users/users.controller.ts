import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /v1/users/me
   * Returns the current authenticated user's full profile
   */
  @Get('me')
  @ApiOperation({ summary: "Get the authenticated user's full profile" })
  @ApiResponse({ status: 200, description: 'User profile returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Req() req: any) {
    const userId: string = req.user.id;
    const user = await this.usersService.getProfile(userId);
    return { success: true, user };
  }

  /**
   * PATCH /v1/users/:id
   * Partially updates a user's profile by their UUID.
   * Only fields explicitly included in the request body are updated.
   * Requires a valid JWT — the caller must be authenticated.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a user profile by UUID' })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    description: 'UUID of the user to update',
  })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID or request body validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(id, dto);
    return { success: true, user };
  }
}
