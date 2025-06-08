import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Entry } from 'generated/prisma';

@Injectable()
export class EntryService {
  constructor(private prisma: PrismaService) {}

  async entry(
    entryWhereUniqueInput: Prisma.EntryWhereUniqueInput,
  ): Promise<Entry | null> {
    return this.prisma.entry.findUnique({
      where: entryWhereUniqueInput,
    });
  }

  async entries(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EntryWhereUniqueInput;
    where?: Prisma.EntryWhereInput;
    orderBy?: Prisma.EntryOrderByWithRelationInput;
  }): Promise<Entry[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.entry.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
    return this.prisma.entry.update({
      where,
      data,
    });
  }

  async deleteEntry(where: Prisma.EntryWhereUniqueInput): Promise<Entry> {
    return this.prisma.entry.delete({
      where,
    });
  }

  async markEntryAsStarted(
    where: Prisma.EntryWhereUniqueInput,
  ): Promise<Entry> {
    return this.prisma.entry.update({
      where,
      data: {
        alreadyStarted: true,
      },
    });
  }

  async markEntryAsNotStarted(
    where: Prisma.EntryWhereUniqueInput,
  ): Promise<Entry> {
    return this.prisma.entry.update({
      where,
      data: {
        alreadyStarted: false,
      },
    });
  }
}
