import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { ConfigModule } from 'src/config/config.module';
import { RecordModule } from 'src/record/record.module';

@Module({
  imports: [ConfigModule, RecordModule],
  providers: [ResultsService],
  controllers: [ResultsController],
})
export class ResultsModule {}
