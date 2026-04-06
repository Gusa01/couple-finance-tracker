import { forwardRef, Module } from '@nestjs/common';
import { CouplesService } from './couples.service';
import { CouplesController } from './couples.controller';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [forwardRef(() => CategoriesModule)],
  providers: [CouplesService],
  controllers: [CouplesController],
  exports: [CouplesService],
})
export class CouplesModule {}
