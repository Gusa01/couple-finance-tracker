import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReceiptsService } from './receipts.service';

@Controller('expenses/:expenseId/receipt')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @CurrentUser() user: User,
    @Param('expenseId') expenseId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.receiptsService.uploadReceipt(expenseId, user.id, file);
  }
}
