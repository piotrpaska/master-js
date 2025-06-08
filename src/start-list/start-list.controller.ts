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
      include: { entries: true, records: true },
    });
  }

  @Get(':id')
  async getStartListById(@Param('id') id: string) {
    const startList = await this.startListService.startList(
      { id },
      { entries: true, records: true },
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
