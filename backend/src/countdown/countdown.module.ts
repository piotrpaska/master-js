import { Module } from '@nestjs/common';
import { CountdownGateway } from './countdown.gateway';

@Module({
  providers: [CountdownGateway],
  exports: [CountdownGateway],
})
export class CountdownModule {}
