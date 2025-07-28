import { Module, forwardRef } from '@nestjs/common';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppComModule } from '../app_com/app_com.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AppComModule)],
  controllers: [EntryController],
  providers: [EntryService],
  exports: [EntryService],
})
export class EntryModule {}
