import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @Get()
  async getRecords() {
    return this.recordService.records({
      include: {
        entry: {
          include: {
            athlete: true,
          },
        },
        startList: true,
      },
    });
  }

  @Get(':id')
  async getRecord(@Param('id') id: string) {
    const record = await this.recordService.record(
      { id },
      {
        entry: {
          include: {
            athlete: true,
          },
        },
        startList: true,
      },
    );
    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }
    return record;
  }

  @Post()
  async createRecord(@Body() data: CreateRecordDto) {
    try {
      // Map CreateRecordDto to RecordCreateInput
      const recordCreateInput = {
        track: data.track,
        duration: data.duration,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        entry: { connect: { id: data.entryId } },
        startList: { connect: { id: data.startListId } },
      };
      return this.recordService.createRecord(recordCreateInput);
    } catch {
      throw new BadRequestException(`Failed to create record`);
    }
  }

  @Put(':id')
  async updateRecord(@Param('id') id: string, @Body() data: CreateRecordDto) {
    try {
      return this.recordService.updateRecord({ id }, data);
    } catch {
      throw new BadRequestException(`Failed to update record`);
    }
  }

  @Post('delete/:id')
  async deleteRecord(@Param('id') id: string) {
    try {
      return this.recordService.deleteRecord({ id });
    } catch {
      throw new NotFoundException(`Failed to delete record`);
    }
  }
}
