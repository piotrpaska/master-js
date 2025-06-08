import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Track } from 'generated/prisma';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async track(
    trackWhereUniqueInput: Prisma.TrackWhereUniqueInput,
  ): Promise<Track | null> {
    return this.prisma.track.findUnique({
      where: trackWhereUniqueInput,
    });
  }

  async tracks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TrackWhereUniqueInput;
    where?: Prisma.TrackWhereInput;
    orderBy?: Prisma.TrackOrderByWithRelationInput;
  }): Promise<Track[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.track.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTrack(data: Prisma.TrackCreateInput): Promise<Track> {
    return this.prisma.track.create({
      data,
    });
  }

  async updateTrack(
    where: Prisma.TrackWhereUniqueInput,
    data: Prisma.TrackUpdateInput,
  ): Promise<Track> {
    return this.prisma.track.update({
      where,
      data,
    });
  }

  async deleteTrack(where: Prisma.TrackWhereUniqueInput): Promise<Track> {
    return this.prisma.track.delete({
      where,
    });
  }
}
