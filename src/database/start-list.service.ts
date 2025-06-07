import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, StartList } from 'generated/prisma';

@Injectable()
export class StartListService {
  constructor(private prisma: PrismaService) {}

  async startList(
    startListWhereUniqueInput: Prisma.StartListWhereUniqueInput,
  ): Promise<StartList | null> {
    return this.prisma.startList.findUnique({
      where: startListWhereUniqueInput,
    });
  }

  async startLists(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StartListWhereUniqueInput;
    where?: Prisma.StartListWhereInput;
    orderBy?: Prisma.StartListOrderByWithRelationInput;
  }): Promise<StartList[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.startList.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createStartList(data: Prisma.StartListCreateInput): Promise<StartList> {
    return this.prisma.startList.create({
      data,
    });
  }

  async updateStartList(
    where: Prisma.StartListWhereUniqueInput,
    data: Prisma.StartListUpdateInput,
  ): Promise<StartList> {
    return this.prisma.startList.update({
      where,
      data,
    });
  }

  async deleteStartList(
    where: Prisma.StartListWhereUniqueInput,
  ): Promise<StartList> {
    return this.prisma.startList.delete({
      where,
    });
  }
}
