import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { StartListService } from './start-list.service';
import { CreateStartListDto } from './dto/create-start-list.dto';

@Controller('start-list')
export class StartListController {
  constructor(private startListService: StartListService) {}

  @Get()
  async getStartList() {
    return this.startListService.startLists({
      include: {
        entries: {
          include: { athlete: true },
        },
        records: true,
      },
    });
  }

  @Get('/:id')
  async getStartListById(@Param('id') id: string) {
    const startList = await this.startListService.startList(
      { id },
      {
        entries: {
          include: { athlete: true },
        },
        records: true,
      },
    );
    if (!startList) {
      throw new NotFoundException(`Start list with id ${id} not found`);
    }
    return startList;
  }

  /*@Put(':id/set-active')
  async setActiveStartList(@Param('id') id: string) {
    
    throw Error('Not implemented yet');
  }*/

  @Get('active')
  async getActiveStartList() {
    const activeStartListId = this.startListService.getActiveStartListId();
    if (!activeStartListId) {
      throw new NotFoundException('No active start list set');
    }
    const activeStartList = await this.startListService.getActiveStartList();
    if (!activeStartList) {
      throw new NotFoundException(
        `Active start list with id ${activeStartListId} not found`,
      );
    }
    return activeStartList;
  }

  @Put(':id/activate')
  async setActiveStartList(@Param('id') id: string) {
    const startList = await this.startListService.startList({ id });
    if (!startList) {
      throw new NotFoundException(`Start list with id ${id} not found`);
    }
    return await this.startListService.setActiveStartListId(id);
  }

  @Put('active-reset')
  async resetActiveStartList() {
    return await this.startListService.resetActiveStartList();
  }

  @Post()
  async createStartList(@Body() data: CreateStartListDto) {
    return this.startListService.createStartList(data);
  }

  @Put(':id')
  async updateStartList(
    @Param('id') id: string,
    @Body() data: CreateStartListDto,
  ) {
    return this.startListService.updateStartList({ id }, data);
  }

  @Delete(':id')
  async deleteStartList(@Param('id') id: string) {
    return this.startListService.deleteStartList({ id });
  }
}
