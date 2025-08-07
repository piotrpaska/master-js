import { Module } from '@nestjs/common';
import { CountdownGateway } from './countdown.gateway';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [CountdownGateway],
  exports: [CountdownGateway],
})
export class CountdownModule {}
