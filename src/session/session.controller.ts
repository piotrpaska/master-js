import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Get()
  async getSessions() {
    return this.sessionService.sessions({});
  }

  @Get('/:id')
  async getSessionById(@Param('id') id: string) {
    const session = await this.sessionService.session(
      { id },
      {
        records: {
          include: {
            entry: {
              include: {
                athlete: true,
              },
            },
          },
        },
      },
    );
    if (!session) {
      throw new NotFoundException(`Session with id ${id} not found`);
    }
    return session;
  }

  @Post()
  async createSession(@Body() data: CreateSessionDto) {
    return this.sessionService.createSession(data);
  }

  @Put(':id')
  async updateSession(@Param('id') id: string, @Body() data: CreateSessionDto) {
    return this.sessionService.updateSession({ id }, data);
  }

  @Delete(':id')
  async deleteSession(@Param('id') id: string) {
    return this.sessionService.deleteSession({ id });
  }
}
