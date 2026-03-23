import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: {
    user_id: number;
    email: string;
  };
}

@ApiTags('Analysis')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('expenses')
  @ApiOperation({ summary: 'Get total expenses (fuel + maintenance)' })
  @ApiQuery({ name: 'carId', required: false, type: Number })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: 'YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: 'YYYY-MM-DD',
  })
  async getExpenses(
    @Req() req: RequestWithUser,
    @Query('carId') carId?: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analysisService.getTotalExpenses(
      req.user.user_id,
      carId,
      from,
      to,
    );
  }

  @Get('fuel')
  @ApiOperation({ summary: 'Get fuel statistics' })
  @ApiQuery({ name: 'carId', required: false, type: Number })
  async getFuelStats(
    @Req() req: RequestWithUser,
    @Query('carId') carId?: number,
  ) {
    return this.analysisService.getFuelStats(req.user.user_id, carId);
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Get maintenance statistics' })
  @ApiQuery({ name: 'carId', required: false, type: Number })
  async getMaintenanceStats(
    @Req() req: RequestWithUser,
    @Query('carId') carId?: number,
  ) {
    return this.analysisService.getMaintenanceStats(req.user.user_id, carId);
  }
}
