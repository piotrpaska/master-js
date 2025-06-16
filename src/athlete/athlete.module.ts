import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AthleteController } from './athlete.controller';
import { AthleteService } from './athlete.service';

@Module({
  imports: [PrismaModule],
  controllers: [AthleteController],
  providers: [AthleteService],
  exports: [AthleteService],
})
export class AthleteModule {}
