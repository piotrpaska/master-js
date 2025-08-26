import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Prisma } from 'generated/prisma';

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
      throw new NotFoundException(`Entry with id ${id} not found`);
    }
  }

  @Post()
  async createEntry(@Body() data: CreateEntryDto) {
    const entryCreateInput: Prisma.EntryCreateInput = {
      athlete: { connect: { id: data.athleteId } },
      startList: { connect: { id: data.startListId } },
      bib: data.bib,
    };

    try {
      return this.entryService.createEntry(entryCreateInput);
    } catch {
      throw new BadRequestException(`Failed to create entry`);
    }
  }

  @Put(':id')
  async updateEntry(@Param('id') id: string, @Body() data: CreateEntryDto) {
    try {
      return this.entryService.updateEntry({ id }, data);
    } catch {
      throw new BadRequestException(`Failed to update entry`);
    }
  }

  @Put(':id/mark-started')
  async markEntryAsStarted(@Param('id') id: string) {
    try {
      return this.entryService.markEntryAsStarted({ id });
    } catch {
      throw new NotFoundException(
        `Entry with id ${id} not found or already started`,
      );
    }
  }

  @Put(':id/restore')
  async restore(@Param('id') id: string) {
    try {
      return this.entryService.markEntryAsNotStarted({ id });
    } catch {
      throw new NotFoundException(
        `Entry with id ${id} not found or already restored`,
      );
    }
  }

  @Put('/restore-start-list/:id')
  async restoreAll(@Param('id') id: string) {
    try {
      return this.entryService.markEntriesOfStartListAsNotStarted(id);
    } catch {
      throw new NotFoundException(
        `Start list with id ${id} not found or entries already restored`,
      );
    }
  }

  @Delete(':id')
  async deleteEntry(@Param('id') id: string) {
    try {
      return this.entryService.deleteEntry({ id });
    } catch {
      throw new NotFoundException(`Entry with id ${id} not found`);
    }
  }
}
