import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
    try {
      const track = await this.trackService.assignEntryIdToTrack(id, entryId);
      if (!track) {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      return track;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }

  @Put(':id/unassign-entry')
  async unassignEntryFromTrack(@Param('id') id: string) {
    try {
      const track = await this.trackService.unassignEntryIdFromTrack(id);
      if (!track) {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      return track;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }

  @Put('/start-all')
  startAllTracks() {
    throw new HttpException(
      {
        status: HttpStatus.NOT_IMPLEMENTED,
        error: 'Not implemented',
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  @Put(':id/start')
  async startTrack(@Param('id') id: string) {
    try {
      const track = await this.trackService.startTrack(id, Date.now());
      return track;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
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
    try {
      const track = await this.trackService.stopTrackWithIncidentAndSave(
        id,
        incident.status,
      );
      if (!track) {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      return track;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }
}
