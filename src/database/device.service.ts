import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Device } from 'generated/prisma';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async device(
    deviceWhereUniqueInput: Prisma.DeviceWhereUniqueInput,
  ): Promise<Device | null> {
    return this.prisma.device.findUnique({
      where: deviceWhereUniqueInput,
    });
  }

  async devices(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DeviceWhereUniqueInput;
    where?: Prisma.DeviceWhereInput;
    orderBy?: Prisma.DeviceOrderByWithRelationInput;
  }): Promise<Device[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.device.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createDevice(data: Prisma.DeviceCreateInput): Promise<Device> {
    return this.prisma.device.create({
      data,
    });
  }

  async updateDevice(
    where: Prisma.DeviceWhereUniqueInput,
    data: Prisma.DeviceUpdateInput,
  ): Promise<Device> {
    return this.prisma.device.update({
      where,
      data,
    });
  }

  async deleteDevice(where: Prisma.DeviceWhereUniqueInput): Promise<Device> {
    return this.prisma.device.delete({
      where,
    });
  }

  async updateHeartbeat(
    where: Prisma.DeviceWhereUniqueInput,
    data: Prisma.DeviceUpdateInput,
  ): Promise<Device> {
    return this.prisma.device.update({
      where,
      data: {
        ...data,
        lastSeen: new Date(),
      },
    });
  }
}
