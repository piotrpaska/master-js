import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Record } from 'generated/prisma';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}

  async record(
    recordWhereUniqueInput: Prisma.RecordWhereUniqueInput,
  ): Promise<Record | null> {
    return this.prisma.record.findUnique({
      where: recordWhereUniqueInput,
    });
  }

  async records(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecordWhereUniqueInput;
    where?: Prisma.RecordWhereInput;
    orderBy?: Prisma.RecordOrderByWithRelationInput;
  }): Promise<Record[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.record.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRecord(data: Prisma.RecordCreateInput): Promise<Record> {
    return this.prisma.record.create({
      data,
    });
  }

  async updateRecord(
    where: Prisma.RecordWhereUniqueInput,
    data: Prisma.RecordUpdateInput,
  ): Promise<Record> {
    return this.prisma.record.update({
      where,
      data,
    });
  }

  async deleteRecord(where: Prisma.RecordWhereUniqueInput): Promise<Record> {
    return this.prisma.record.delete({
      where,
    });
  }
}
