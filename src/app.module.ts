import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AthleteModule } from './athlete/athlete.module';

@Module({
  imports: [PrismaModule, AthleteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
