import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: {
    user_id: number;
    email: string;
  };
}

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  create(
    @Req() req: RequestWithUser,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.create(
      req.user.user_id,
      createTransactionDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all user transactions with filtering and pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'accountId', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['date', 'amount'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Req() req: RequestWithUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('accountId') accountId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('sortBy') sortBy?: 'date' | 'amount',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.transactionService.findAll(req.user.user_id, {
      page,
      limit,
      accountId,
      categoryId,
      from,
      to,
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction details' })
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.transactionService.findOne(req.user.user_id, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction' })
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(
      req.user.user_id,
      +id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.transactionService.remove(req.user.user_id, +id);
  }
}
