import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
import { McqAnswersService } from './mcq-answers.service';
import { CreateMcqAnswerDto } from './dto/create-mcq-answer.dto';

@ApiTags('McqAnswers')
@ApiBearerAuth()
@Controller('mcq-answers')
@UseGuards(AuthGuard('jwt'))
export class McqAnswersController {
  constructor(private readonly mcqAnswersService: McqAnswersService) {}

  /**
   * POST /v1/mcq-answers
   * Creates a new MCQ answer record for the specified user.
   */
  @Post()
  @ApiOperation({ summary: 'Submit MCQ answers for a user' })
  @ApiResponse({
    status: 201,
    description: 'MCQ answers created successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/McqAnswerDto' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed — invalid body' })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async create(@Body() dto: CreateMcqAnswerDto) {
    const data = await this.mcqAnswersService.create(dto);
    return { success: true, data };
  }

  /**
   * GET /v1/mcq-answers/user/:userId
   * Returns all MCQ answer records for the specified user.
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'List all MCQ answers for a user' })
  @ApiParam({
    name: 'userId',
    type: String,
    format: 'uuid',
    description: 'UUID of the user whose MCQ answers to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'MCQ answers retrieved successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: { type: 'array', items: { $ref: '#/components/schemas/McqAnswerDto' } },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findAllByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    const data = await this.mcqAnswersService.findAllByUserId(userId);
    return { success: true, data };
  }
}
