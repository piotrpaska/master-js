import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { Entry as EntryModel, RecordStatus } from 'generated/prisma';
import { EntryService } from 'src/entry/entry.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { RecordService } from 'src/record/record.service';

@Injectable()
export class TrackService implements OnModuleInit {
  constructor(
    private entryService: EntryService,
    private recordService: RecordService,
  ) {}

  onModuleInit() {
    // This will be called when the module is initialized
    // Setup tracks
  }

  private tracks: Track[] = [];

  createTrack(data: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: data.name,
      startTime: BigInt(0),
      prevDuration: BigInt(0),
      running: false,
      entryId: null,
      relatedLastRecordId: null,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  getTracks(): Track[] {
    return this.tracks;
  }

  async getTracksWithEntryData(): Promise<
    (Track & { entry: EntryModel | null })[]
  > {
    return Promise.all(
      this.tracks.map(async (track) => {
        const entry = track.entryId
          ? await this.entryService.entry(
              { id: track.entryId },
              { startList: true, athlete: true },
            )
          : null;

        return {
          ...track,
          entry: track.entryId
            ? {
                id: track.entryId,
                athleteId: entry?.athleteId || '',
                startListId: entry?.startListId || '',
                bib: entry?.bib || '',
                alreadyStarted: entry?.alreadyStarted || false,
              }
            : null,
        };
      }),
    );
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  async getTrackWithEntryDataById(
    id: string,
  ): Promise<(Track & { entry: EntryModel | null }) | null> {
    const track = this.getTrackById(id);
    if (!track) {
      return Promise.resolve(null);
    }
    const entry = await this.entryService.entry(
      { id: track.entryId || '' },
      { startList: true, athlete: true },
    );
    return {
      ...track,
      entry: entry
        ? {
            id: entry.id,
            athleteId: entry.athleteId,
            startListId: entry.startListId,
            bib: entry.bib,
            alreadyStarted: entry.alreadyStarted,
          }
        : null,
    };
  }

  updateTrack(id: string, updatedTrack: Partial<Track>): Track | undefined {
    const track = this.getTrackById(id);
    if (track) {
      Object.assign(track, updatedTrack);
    }
    return track;
  }

  deleteTrack(id: string): boolean {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      return true;
    }
    return false;
  }

  clearTracks(): void {
    this.tracks = [];
  }

  assignEntryIdToTrack(id: string, entryId: string | null): Track | null {
    const track = this.getTrackById(id);
    if (track) {
      track.entryId = entryId;
      return track;
    }
    return null;
  }

  startTrack(id: string, startTime: bigint): Track | null {
    const track = this.getTrackById(id);
    if (track) {
      if (track.running) {
        throw new Error(`Track with ID ${id} is already running`);
      }

      if (track.entryId === null) {
        throw new Error(`Track with ID ${id} has no entry assigned`);
      }

      track.startTime = startTime;
      track.running = true;
      track.prevDuration = BigInt(0);
      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async stopTrackAndSaveTime(
    id: string,
    endTime: bigint,
  ): Promise<Track | null> {
    const track = this.getTrackById(id);
    if (track) {
      if (!track.running) {
        throw new Error(`Track with ID ${id} is not running`);
      }

      if (track.entryId === null) {
        throw new Error(`Track with ID ${id} has no entry assigned`);
      }

      if (track.startTime === null || track.startTime === BigInt(0)) {
        throw new Error(`Track with ID ${id} has not been started`);
      }

      const entryId = track.entryId;
      const startTime = track.startTime;
      const duration = endTime - track.startTime;

      track.running = false;
      track.prevDuration = duration;
      track.startTime = null;
      track.entryId = null;

      const entry = await this.entryService.entry({ id: entryId });

      if (!entry) {
        throw new NotFoundException(`Entry with ID ${entryId} not found`);
      }

      await this.entryService.updateEntry(
        { id: entryId },
        { alreadyStarted: true },
      );

      const record = await this.recordService.createRecord({
        track: track.name,
        duration: duration,
        startTime: startTime,
        endTime: endTime,
        status: 'OK',
        entry: { connect: { id: entryId } },
        startList: { connect: { id: entry.startListId } },
      });

      track.relatedLastRecordId = record.id;

      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async stopTrackWithIncidentAndSave(
    id: string,
    status: RecordStatus,
  ): Promise<Track | null> {
    const track = this.getTrackById(id);
    if (track) {
      if (!track.running) {
        throw new Error(`Track with ID ${id} is not running`);
      }

      if (track.entryId === null) {
        throw new Error(`Track with ID ${id} has no entry assigned`);
      }

      if (track.startTime === null || track.startTime === BigInt(0)) {
        throw new Error(`Track with ID ${id} has not been started`);
      }

      const entryId = track.entryId;
      const startTime = track.startTime;

      track.running = false;
      track.prevDuration = null;
      track.startTime = null;
      track.entryId = null;

      const entry = await this.entryService.entry({ id: entryId });

      if (!entry) {
        throw new NotFoundException(`Entry with ID ${entryId} not found`);
      }

      await this.entryService.updateEntry(
        { id: entryId },
        { alreadyStarted: true },
      );

      const record = await this.recordService.createRecord({
        track: track.name,
        duration: null,
        startTime: startTime,
        endTime: null,
        status: status,
        entry: { connect: { id: entryId } },
        startList: { connect: { id: entry.startListId } },
      });

      track.relatedLastRecordId = record.id;

      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  pauseTrack(id: string): Track | null {
    const track = this.getTrackById(id);
    if (track) {
      if (!track.running) {
        throw new Error(`Track with ID ${id} is not running`);
      }

      track.running = false;
      track.startTime = null;
      track.prevDuration = null;
      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }
}
