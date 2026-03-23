import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { MonobankService } from './monobank.service';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: {
    user_id: number;
    email: string;
  };
}

@ApiTags('Integrations - Monobank')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('monobank')
export class MonobankController {
  constructor(
    private readonly monobankService: MonobankService,
    private readonly configService: ConfigService,
  ) {}

  @Get('client-info')
  @ApiOperation({
    summary: 'Синхронізувати інфо клієнта та оновити список карток',
  })
  @ApiQuery({ name: 'token', required: false })
  async getInfo(@Req() req: RequestWithUser, @Query('token') token?: string) {
    const apiToken =
      token || this.configService.get<string>('MONOBANK_API_TOKEN');
    if (!apiToken)
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);

    return this.monobankService.getClientInfo(req.user.user_id, apiToken);
  }

  @Get('cards')
  @ApiOperation({ summary: 'Список усіх збережених карток' })
  async getCards(@Req() req: RequestWithUser) {
    return this.monobankService.getSavedCards(req.user.user_id);
  }

  @Get('cards/:id')
  @ApiOperation({ summary: 'Дані однієї картки за ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async getCard(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.monobankService.getSavedCardById(req.user.user_id, id);
  }

  @Post('setup-accounts')
  @ApiOperation({
    summary: 'Створити Account для кожної картки Mono, якої ще немає в БД',
  })
  async setupAccounts(@Req() req: RequestWithUser) {
    return this.monobankService.initializeAccountsFromCards(req.user.user_id);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Ручна синхронізація транзакцій для Account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accountId: { type: 'number' },
        token: { type: 'string', nullable: true },
      },
    },
  })
  async sync(
    @Req() req: RequestWithUser,
    @Body('accountId') accountId: number,
    @Body('token') token?: string,
  ) {
    const apiToken =
      token || this.configService.get<string>('MONOBANK_API_TOKEN');
    if (!apiToken)
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);

    return this.monobankService.syncTransactions(
      req.user.user_id,
      accountId,
      apiToken,
    );
  }
}
