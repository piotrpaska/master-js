import { forwardRef, Module } from '@nestjs/common';
import { StartListController } from './start-list.controller';
import { StartListService } from './start-list.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppComModule } from 'src/app_com/app_com.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AppComModule)],
  controllers: [StartListController],
  providers: [StartListService],
  exports: [StartListService],
})
export class StartListModule {}
