import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BalanceService } from './balance.service';
import { SettleBalanceDto } from './dto/settle-balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  getBalance(@CurrentUser() user: User) {
    return this.balanceService.getBalance(user.id);
  }

  @Get('history')
  getHistory(@CurrentUser() user: User) {
    return this.balanceService.getHistory(user.id);
  }

  @Post('settle')
  settle(@CurrentUser() user: User, @Body() dto: SettleBalanceDto) {
    return this.balanceService.settle(user.id, dto);
  }
}
