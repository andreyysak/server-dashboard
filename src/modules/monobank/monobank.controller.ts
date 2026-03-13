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
  @ApiOperation({ summary: 'Інформація про клієнта та рахунки з API Monobank' })
  @ApiQuery({ name: 'token', required: false })
  async getInfo(@Req() req: RequestWithUser, @Query('token') token?: string) {
    const apiToken =
      token || this.configService.get<string>('MONOBANK_API_TOKEN');
    if (!apiToken) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }
    return this.monobankService.getClientInfo(req.user.user_id, apiToken);
  }

  @Get('cards')
  @ApiOperation({ summary: 'Отримати всі збережені картки з бази даних' })
  async getCards(@Req() req: RequestWithUser) {
    return this.monobankService.getSavedCards(req.user.user_id);
  }

  @Get('cards/:id')
  @ApiOperation({
    summary: 'Отримати дані конкретної картки за її внутрішнім ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Внутрішній ID картки з таблиці mono_cards',
  })
  async getCard(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.monobankService.getSavedCardById(req.user.user_id, id);
  }

  @Post('sync')
  @ApiOperation({
    summary: 'Синхронізувати транзакції для конкретного акаунта',
  })
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
    if (!apiToken) {
      throw new HttpException('Token missing', HttpStatus.UNAUTHORIZED);
    }
    return this.monobankService.syncTransactions(
      req.user.user_id,
      accountId,
      apiToken,
    );
  }
}
