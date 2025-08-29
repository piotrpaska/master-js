import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { ConfigModule } from 'src/config/config.module';
import { RecordModule } from 'src/record/record.module';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [ConfigModule, RecordModule, SessionModule],
  providers: [ResultsService],
  controllers: [ResultsController],
})
export class ResultsModule {}
