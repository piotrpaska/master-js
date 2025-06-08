import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, LiveAgents } from 'generated/prisma';

@Injectable()
export class LiveAgentsService {
  constructor(private prisma: PrismaService) {}

  async liveAgent(
    liveAgentWhereUniqueInput: Prisma.LiveAgentsWhereUniqueInput,
  ): Promise<LiveAgents | null> {
    return this.prisma.liveAgents.findUnique({
      where: liveAgentWhereUniqueInput,
    });
  }

  async liveAgents(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LiveAgentsWhereUniqueInput;
    where?: Prisma.LiveAgentsWhereInput;
    orderBy?: Prisma.LiveAgentsOrderByWithRelationInput;
  }): Promise<LiveAgents[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.liveAgents.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLiveAgent(
    data: Prisma.LiveAgentsCreateInput,
  ): Promise<LiveAgents> {
    return this.prisma.liveAgents.create({
      data,
    });
  }
  async updateLiveAgent(
    where: Prisma.LiveAgentsWhereUniqueInput,
    data: Prisma.LiveAgentsUpdateInput,
  ): Promise<LiveAgents> {
    return this.prisma.liveAgents.update({
      where,
      data,
    });
  }
  async deleteLiveAgent(
    where: Prisma.LiveAgentsWhereUniqueInput,
  ): Promise<LiveAgents> {
    return this.prisma.liveAgents.delete({
      where,
    });
  }

  async updateLiveAgentStatus(
    where: Prisma.LiveAgentsWhereUniqueInput,
    data: Prisma.LiveAgentsUpdateInput,
  ): Promise<LiveAgents> {
    return this.prisma.liveAgents.update({
      where,
      data,
    });
  }
}
