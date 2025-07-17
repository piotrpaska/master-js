import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, StartList } from 'generated/prisma';
import { AppComGateway } from 'src/app_com/app_com.gateway';

@Injectable()
export class StartListService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AppComGateway))
    private appComGateway: AppComGateway,
  ) {}

  private activeStartListId: string | null = null;

  async setActiveStartListId(id: string): Promise<string> {
    const startList = await this.startList({ id });
    if (!startList) {
      throw new Error(`Start list with id ${id} not found`);
    }

    this.activeStartListId = id;
    await this.appComGateway.updateClientsData();
    return this.activeStartListId;
  }

  async resetActiveStartList(): Promise<void> {
    this.activeStartListId = null;
    await this.appComGateway.updateClientsData();
  }

  getActiveStartListId(): string | null {
    return this.activeStartListId;
  }

  async getActiveStartList(): Promise<StartList | null> {
    if (!this.activeStartListId) {
      return null;
    }
    return this.prisma.startList.findUnique({
      where: { id: this.activeStartListId },
      include: {
        entries: {
          include: {
            athlete: true,
          },
        },
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
    });
  }

  async startList(
    startListWhereUniqueInput: Prisma.StartListWhereUniqueInput,
    include?: Prisma.StartListInclude,
  ): Promise<StartList | null> {
    return this.prisma.startList.findUnique({
      where: startListWhereUniqueInput,
      include,
    });
  }

  async startLists(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StartListWhereUniqueInput;
    where?: Prisma.StartListWhereInput;
    orderBy?: Prisma.StartListOrderByWithRelationInput;
    include?: Prisma.StartListInclude;
  }): Promise<StartList[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return await this.prisma.startList.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
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
