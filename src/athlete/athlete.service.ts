import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Athlete } from 'generated/prisma';

@Injectable()
export class AthleteService {
  constructor(private prisma: PrismaService) {}

  async athlete(
    athleteWhereUniqueInput: Prisma.AthleteWhereUniqueInput,
    include?: Prisma.AthleteInclude,
  ): Promise<Athlete | null> {
    return this.prisma.athlete.findUnique({
      where: athleteWhereUniqueInput,
      include,
    });
  }

  async athletes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AthleteWhereUniqueInput;
    where?: Prisma.AthleteWhereInput;
    orderBy?: Prisma.AthleteOrderByWithRelationInput;
    include?: Prisma.AthleteInclude;
  }): Promise<Athlete[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.athlete.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async createAthlete(data: Prisma.AthleteCreateInput): Promise<Athlete> {
    return this.prisma.athlete.create({
      data,
    });
  }

  async updateAthlete(
    where: Prisma.AthleteWhereUniqueInput,
    data: Prisma.AthleteUpdateInput,
  ): Promise<Athlete> {
    return this.prisma.athlete.update({
      where,
      data,
    });
  }

  async deleteAthlete(where: Prisma.AthleteWhereUniqueInput): Promise<Athlete> {
    return this.prisma.athlete.delete({
      where,
    });
  }
}
