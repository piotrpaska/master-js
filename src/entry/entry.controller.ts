import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('entry')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get()
  async getEntries() {
    return this.entryService.entries({});
  }

  @Get(':id')
  async getEntry(@Param() id: string) {
    try {
      return this.entryService.entry({ id });
    } catch {
      return null;
    }
  }

  @Post()
  async createEntry(@Body() data: CreateEntryDto) {
    return this.entryService.createEntry(data);
  }

  @Put(':id')
  async updateEntry(@Param() id: string, @Body() data: CreateEntryDto) {
    return this.entryService.updateEntry({ id }, data);
  }

  @Put(':id/mark-started')
  async markEntryAsStarted(@Param() id: string) {
    return this.entryService.markEntryAsStarted({ id });
  }

  @Put(':id/restore')
  async restore(@Param() id: string) {
    return this.entryService.markEntryAsNotStarted({ id });
  }

  @Put('/restore-all')
  async restoreAll() {
    return this.entryService.markEntryAsNotStarted({ id: undefined });
  }

  @Delete(':id')
  async deleteEntry(@Param() id: string) {
    return this.entryService.deleteEntry({ id });
  }
}
