import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Entry } from 'generated/prisma';
import { AppComGateway } from 'src/app_com/app_com.gateway';

@Injectable()
export class EntryService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AppComGateway))
    private appComGateway: AppComGateway,
  ) {}

  async entry(
    entryWhereUniqueInput: Prisma.EntryWhereUniqueInput,
    include?: Prisma.EntryInclude,
  ): Promise<Entry | null> {
    return this.prisma.entry.findUnique({
      where: entryWhereUniqueInput,
      include,
    });
  }

  async entries(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EntryWhereUniqueInput;
    where?: Prisma.EntryWhereInput;
    orderBy?: Prisma.EntryOrderByWithRelationInput;
    include?: Prisma.EntryInclude;
  }): Promise<Entry[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.entry.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async createEntry(data: Prisma.EntryCreateInput): Promise<Entry> {
    return this.prisma.entry.create({
      data,
    });
  }

  async updateEntry(
    where: Prisma.EntryWhereUniqueInput,
    data: Prisma.EntryUpdateInput,
  ): Promise<Entry> {
    const entry = await this.prisma.entry.update({
      where,
      data,
    });

    await this.appComGateway.updateClientsData();
    return entry;
  }

  async deleteEntry(where: Prisma.EntryWhereUniqueInput): Promise<Entry> {
    return this.prisma.entry.delete({
      where,
    });
  }

  async markEntryAsStarted(
    where: Prisma.EntryWhereUniqueInput,
  ): Promise<Entry> {
    const entry = await this.prisma.entry.update({
      where,
      data: {
        alreadyStarted: true,
      },
    });
    await this.appComGateway.updateClientsData();
    return entry;
  }

  async markEntryAsNotStarted(
    where: Prisma.EntryWhereUniqueInput | undefined,
  ): Promise<Entry> {
    const entry = await this.prisma.entry.update({
      where: where || { id: undefined },
      data: {
        alreadyStarted: false,
      },
    });
    await this.appComGateway.updateClientsData();
    return entry;
  }

  async markEntriesOfStartListAsNotStarted(
    startListId: string,
  ): Promise<Entry[]> {
    await this.prisma.entry.updateMany({
      where: { startListId },
      data: { alreadyStarted: false },
    });
    const entries = await this.prisma.entry.findMany({
      where: { startListId },
    });
    await this.appComGateway.updateClientsData();
    return entries;
  }
}
