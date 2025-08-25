import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Athlete, Entry, Prisma, Session, StartList } from 'generated/prisma';
import { AppComGateway } from 'src/app_com/app_com.gateway';

// Extend the BigInt interface to include toJSON
declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (this: bigint): string {
  return this.toString();
};

@Injectable()
export class StartListService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AppComGateway))
    private appComGateway: AppComGateway,
  ) {}

  private activeStartListId: string | null = null;
  private activeSessionId: string | null = null;

  async setActiveStartListId(id: string, sessionId?: string): Promise<string> {
    const startList = await this.startList({ id });
    if (!startList) {
      throw new Error(`Start list with id ${id} not found`);
    }

    this.activeStartListId = id;
    this.activeSessionId = sessionId || null;
    await this.appComGateway.updateClientsData();
    console.log(await this.getActiveStartList());
    return this.activeStartListId;
  }

  async resetActiveStartList(): Promise<void> {
    this.activeStartListId = null;
    this.activeSessionId = null;
    await this.appComGateway.updateClientsData();
  }

  getActiveStartListId(): string | null {
    return this.activeStartListId;
  }

  getActiveSessionId(): string | null {
    return this.activeSessionId;
  }

  async getActiveStartList(): Promise<{
    title: string;
    entries: (Omit<Entry, 'startListId'> & {
      athlete: Athlete | null;
    })[];
    session: Session | null;
  } | null> {
    if (!this.activeStartListId) {
      return null;
    }
    const startList = await this.prisma.startList.findUnique({
      where: { id: this.activeStartListId },
      include: {
        entries: {
          include: {
            athlete: true,
          },
        },
      },
    });

    let session: Session | null = null;
    if (this.activeSessionId) {
      try {
        session = await this.prisma.session.findUnique({
          where: { id: this.activeSessionId },
          include: {
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
      } catch (error) {
        console.error('Failed to fetch session:', error);
        session = null;
      }
    }

    return {
      title: startList!.title,
      entries: startList!.entries,
      session,
    };
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
