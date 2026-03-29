import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Get,
  Query,
} from '@nestjs/common';
import { HabitLogService } from './habit-log.service';
import { HabitLogDto } from './dto/log-habit.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Habit Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('habits/:habitId/logs')
export class HabitLogController {
  constructor(private readonly habitLogService: HabitLogService) {}

  @Post()
  @ApiOperation({ summary: 'Mark habit as completed for a specific date' })
  markCompleted(
    @Req() req,
    @Param('habitId', ParseIntPipe) habitId: number,
    @Body() habitLogDto: HabitLogDto,
  ) {
    return this.habitLogService.markCompleted(req.user.user_id, habitId, habitLogDto);
  }

  @Delete(':date')
  @ApiOperation({ summary: 'Unmark habit completion for a specific date' })
  unmarkCompleted(
    @Req() req,
    @Param('habitId', ParseIntPipe) habitId: number,
    @Param('date') date: string, // YYYY-MM-DD
  ) {
    return this.habitLogService.unmarkCompleted(req.user.user_id, habitId, date);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get statistics for a habit (streaks, completion rate)' })
  getStats(@Req() req, @Param('habitId', ParseIntPipe) habitId: number) {
    return this.habitLogService.getStats(req.user.user_id, habitId);
  }
}
