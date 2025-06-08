import { Module } from '@nestjs/common';
import { StartListController } from './start-list.controller';
import { StartListService } from './start-list.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StartListController],
  providers: [StartListService],
  exports: [StartListService],
})
export class StartListModule {}
