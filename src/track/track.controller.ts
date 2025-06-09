import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  async getTracks() {
    return this.trackService.getTracksWithEntryData();
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    const tracks = await this.trackService.getTracksWithEntryData();
    const track = tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }

  @Put(':id/assign-entry/:entryId')
  async assignEntryToTrack(
    @Param('id') id: string,
    @Param('entryId') entryId: string | null,
  ) {
    const track = await this.trackService.getTrackWithEntryDataById(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return this.trackService.assignEntryIdToTrack(id, entryId);
  }

  @Put(':id/pause')
  pauseTrack(@Param('id') id: string) {
    try {
      return this.trackService.pauseTrack(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Put(':id/incident')
  async stopTrackWithIncident(
    @Param('id') id: string,
    @Body('incident') incident: { status: 'OK' | 'DNS' | 'DNF' | 'DSQ' },
  ) {
    const track = await this.trackService.stopTrackWithIncidentAndSave(
      id,
      incident.status,
    );
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
  }
}
