import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { MonobankService } from './monobank.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Integrations - Monobank')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('monobank')
export class MonobankController {
  constructor(private readonly monobankService: MonobankService) {}

  @Get('client-info')
  @ApiOperation({
    summary: 'Інформація про клієнта та рахунки',
    description: 'Повертає список карток. Використовуйте поле "id" звідси для прив’язки до вашого Account.'
  })
  @ApiQuery({ name: 'token', description: 'Ваш X-Token з api.monobank.ua' })
  async getInfo(@Query('token') token: string) {
    return this.monobankService.getClientInfo(token);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Синхронізувати транзакції' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'X-Token' },
        accountId: { type: 'number', description: 'Внутрішній ID рахунку з вашої БД (account_id)' }
      }
    }
  })
  async sync(
      @Req() req,
      @Body('token') token: string,
      @Body('accountId') accountId: number,
  ) {
    // req.user.user_id беремо з JWT токена
    return this.monobankService.syncTransactions(req.user.user_id, token, accountId);
  }
}