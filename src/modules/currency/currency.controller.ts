import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Get latest currency rates (UAH vs USD, EUR, PLN, GBP)' })
  async getLatest() {
    return this.currencyService.getLatestFormatted();
  }

  @Get('history/:code')
  @ApiOperation({ summary: 'Get historical rates for a specific currency' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(
    @Param('code', ParseIntPipe) code: number,
    @Query('limit') limit?: number,
  ) {
    return this.currencyService.getHistory(code, limit);
  }

  @Get('trigger-fetch')
  @ApiOperation({ summary: 'Manually trigger fetch (for testing)' })
  async triggerFetch() {
    await this.currencyService.fetchRates();
    return { success: true };
  }
}
