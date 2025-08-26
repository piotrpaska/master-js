import { forwardRef, Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AppComModule } from 'src/app_com/app_com.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AppComModule)],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
