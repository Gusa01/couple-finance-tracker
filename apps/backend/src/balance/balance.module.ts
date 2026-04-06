import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { CouplesModule } from '../couples/couples.module';

@Module({
  imports: [CouplesModule],
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
