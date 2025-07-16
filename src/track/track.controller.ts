import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { SpeakerGateway } from 'src/speaker/speaker.gateway';

@Controller('track')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private readonly speakerGateway: SpeakerGateway,
  ) {}

  @Get()
  getTracks() {
    return this.trackService.getTracks();
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

  @Put('/start-all')
  startAllTracks() {
    throw new Error(
      'This method is not implemented yet. Please use the start sequence service instead.',
    );
  }

  @Put(':id/start')
  async startTrack(@Param('id') id: string) {
    const track = await this.trackService.startTrack(id, Date.now());
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return track;
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
    @Body() incident: { status: 'OK' | 'DNS' | 'DNF' | 'DSQ' },
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
