import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FeelingsService } from './feelings.service';
import { CreateFeelingDto } from './dto/create-feeling.dto';

@ApiTags('Feelings')
@ApiBearerAuth()
@Controller('feelings')
@UseGuards(AuthGuard('jwt'))
export class FeelingsController {
  constructor(private readonly feelingsService: FeelingsService) {}

  @Get('today')
  @ApiOperation({ summary: "Get the authenticated user's feeling for today" })
  @ApiResponse({ status: 200, description: 'Feeling retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTodayFeeling(@Req() req: any) {
    const userId: string = req.user.id;
    const feeling = await this.feelingsService.findToday(userId);
    return feeling;
  }

  @Post()
  @ApiOperation({ summary: 'Submit a feeling for today' })
  @ApiResponse({ status: 201, description: 'Feeling created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Feeling already submitted for today' })
  async createFeeling(@Req() req: any, @Body() dto: CreateFeelingDto) {
    const userId: string = req.user.id;
    const feeling = await this.feelingsService.create(userId, dto);
    return feeling;
  }
}
