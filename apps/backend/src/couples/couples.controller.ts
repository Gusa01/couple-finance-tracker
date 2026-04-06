import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CouplesService } from './couples.service';
import { JoinCoupleDto } from './dto/join-couple.dto';

@Controller('couples')
export class CouplesController {
  constructor(private readonly couplesService: CouplesService) {}

  @Post('invite')
  createInvite(@CurrentUser() user: User) {
    return this.couplesService.createInvite(user);
  }

  @Post('join')
  joinCouple(@CurrentUser() user: User, @Body() dto: JoinCoupleDto) {
    return this.couplesService.joinCouple(user, dto);
  }

  @Get('me')
  getMyCouple(@CurrentUser() user: User) {
    return this.couplesService.getMyCouple(user.id);
  }
}
