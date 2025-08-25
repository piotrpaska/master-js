import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Session } from 'generated/prisma';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  async session(
    sessionWhereUniqueInput: Prisma.SessionWhereUniqueInput,
    include?: Prisma.SessionInclude,
  ): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: sessionWhereUniqueInput,
      include,
    });
  }

  async sessions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SessionWhereUniqueInput;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput;
    include?: Prisma.SessionInclude;
  }): Promise<Session[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return await this.prisma.session.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async createSession(data: {
    title: string;
    startListId: string;
  }): Promise<Session> {
    return this.prisma.session.create({
      data: {
        title: data.title,
        startList: { connect: { id: data.startListId } },
      },
    });
  }

  async updateSession(
    where: Prisma.SessionWhereUniqueInput,
    data: { title?: string; startListId?: string },
  ): Promise<Session> {
    const updateData: Prisma.SessionUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.startListId !== undefined) {
      updateData.startList = { connect: { id: data.startListId } };
    }
    return this.prisma.session.update({
      where,
      data: updateData,
    });
  }

  async deleteSession(where: Prisma.SessionWhereUniqueInput): Promise<Session> {
    return this.prisma.session.delete({
      where,
    });
  }
}
