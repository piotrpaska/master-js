import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { Athlete as AthleteModel } from 'generated/prisma';
import { CreateAthleteDto } from './dto/create-athlete.dto';

@Controller('athlete')
export class AthleteController {
  constructor(private athleteService: AthleteService) {}

  @Get()
  async getAthletes(): Promise<AthleteModel[]> {
    return this.athleteService.athletes({
      include: {
        entries: {
          include: {
            startList: true,
          },
        },
      },
    });
  }

  @Get(':id')
  async getAthlete(@Param('id') id: string): Promise<AthleteModel | null> {
    const athlete = await this.athleteService.user(
      { id },
      { entries: { include: { startList: true } } },
    );
    if (!athlete) {
      throw new NotFoundException(`Athlete with id ${id} not found`);
    }
    return athlete;
  }

  @Post()
  async createAthlete(
    @Body() athleteData: CreateAthleteDto,
  ): Promise<AthleteModel> {
    try {
      return await this.athleteService.createAthlete(athleteData);
    } catch {
      // Handle validation or format errors
      throw new BadRequestException('Invalid athlete data format');
    }
  }

  @Put(':id')
  async updateAthlete(
    @Param('id') id: string,
    @Body() athleteData: CreateAthleteDto,
  ): Promise<AthleteModel> {
    return this.athleteService.updateAthlete({ id }, athleteData);
  }

  @Delete(':id')
  async deleteAthlete(@Param('id') id: string): Promise<AthleteModel> {
    return this.athleteService.deleteAthlete({ id });
  }
}
