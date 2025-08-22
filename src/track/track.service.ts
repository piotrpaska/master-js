import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { Entry as EntryModel, RecordStatus } from 'generated/prisma';
import { EntryService } from 'src/entry/entry.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { RecordService } from 'src/record/record.service';
import { ConfigService } from 'src/config/config.service';
import { AppComGateway } from 'src/app_com/app_com.gateway';
import { SpeakerGateway } from 'src/speaker/speaker.gateway';

@Injectable()
export class TrackService implements OnModuleInit {
  constructor(
    @Inject(forwardRef(() => EntryService))
    private entryService: EntryService,
    private recordService: RecordService,
    @Inject(forwardRef(() => ConfigService))
    private configService: ConfigService,
    @Inject(forwardRef(() => AppComGateway))
    private appComModule: AppComGateway,
    private readonly speakerService: SpeakerGateway,
  ) {}

  onModuleInit() {
    const config = this.configService.getConfig();
    if (!config.tracks || config.tracks.length === 0) {
      throw new Error('No tracks defined in the configuration');
    }
    this.tracks = config.tracks.map((trackConfig) =>
      this.createTrack({
        id: trackConfig.id,
        name: trackConfig.name,
      }),
    );
  }

  tracks: Track[] = [];

  reInitTracks() {
    this.tracks = [];
    const config = this.configService.getConfig();
    if (!config.tracks || config.tracks.length === 0) {
      throw new Error('No tracks defined in the configuration');
    }
    this.tracks = config.tracks.map((trackConfig) =>
      this.createTrack({
        id: trackConfig.id,
        name: trackConfig.name,
      }),
    );
  }

  createTrack(data: CreateTrackDto): Track {
    const newTrack: Track = {
      id: data.id,
      name: data.name,
      startTime: null,
      prevDuration: null,
      running: false,
      entryId: null,
      relatedLastRecordId: null,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  getTracks(): Track[] {
    return this.tracks.map((track) => ({
      ...track,
      elapsedTime: track.startTime ? Date.now() - track.startTime : 0,
    }));
  }

  async getTracksWithEntryData(): Promise<
    (Track & { entry: EntryModel | null; elapsedTime: number })[]
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
          entry: entry,
          elapsedTime: track.startTime ? Date.now() - track.startTime : 0,
        };
      }),
    );
  }

  getTrackById(id: string): (Track & { elapsedTime: number }) | undefined {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      return {
        ...track,
        elapsedTime: track.startTime ? Date.now() - track.startTime : 0,
      };
    }
    return undefined;
  }

  async getTrackWithEntryDataById(
    id: string,
  ): Promise<
    (Track & { entry: EntryModel | null; elapsedTime: number }) | null
  > {
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
      entry: entry,
      elapsedTime: track.startTime ? Date.now() - track.startTime : 0,
    };
  }

  async updateTrack(
    id: string,
    updatedTrack: Partial<Track>,
  ): Promise<Track | undefined> {
    const track = this.getTrackById(id);
    if (track) {
      Object.assign(track, updatedTrack);
    }
    await this.appComModule.updateClientsData();
    return track;
  }

  async deleteTrack(id: string): Promise<Track | null> {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index !== -1) {
      this.tracks.splice(index, 1);
      await this.appComModule.updateClientsData();
      return null;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async clearTracks(): Promise<void> {
    this.tracks = [];
    await this.appComModule.updateClientsData();
  }

  async assignEntryIdToTrack(
    id: string,
    entryId: string | null,
  ): Promise<Track | null> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      if (this.tracks.some((t) => t.entryId === entryId && t.id !== id)) {
        throw new Error(
          `Entry with ID ${entryId} is already assigned to another track`,
        );
      }

      track.entryId = entryId;

      await this.appComModule.updateClientsData();
      return track;
    }
    await this.appComModule.updateClientsData();
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async unassignEntryIdFromTrack(id: string): Promise<Track | null> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      track.entryId = null;
      await this.appComModule.updateClientsData();
      return track;
    }
    await this.appComModule.updateClientsData();
    return null;
  }

  async startAllTracks(startTime: number): Promise<void> {
    for (const track of this.tracks) {
      try {
        await this.startTrack(track.id, startTime);
      } catch (error) {
        console.error(`Failed to start track ${track.id}: ${error}`);
      }
    }
    await this.appComModule.updateClientsData();
  }

  async startTrack(id: string, startTime: number): Promise<Track | null> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      if (track.running) {
        throw new Error(`Track with ID ${id} is already running`);
      }

      if (track.entryId === null) {
        throw new Error(`Track with ID ${id} has no entry assigned`);
      }

      track.startTime = startTime;
      track.running = true;
      track.prevDuration = null;
      await this.appComModule.updateClientsData();
      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async stopTrackAndSaveTime(
    id: string,
    endTime: number,
  ): Promise<Track | null> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      if (!track.running) {
        throw new Error(`Track with ID ${id} is not running`);
      }

      if (track.entryId === null) {
        throw new Error(`Track with ID ${id} has no entry assigned`);
      }

      if (track.startTime === null || track.startTime === 0) {
        throw new Error(`Track with ID ${id} has not been started`);
      }

      this.speakerService.signalizeTrackStop();

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
        {
          alreadyStarted: this.configService.getConfig().options
            .blockEntryAfterRun
            ? true
            : false,
        },
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
      await this.appComModule.updateClientsData();
      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async stopTrackWithIncidentAndSave(
    id: string,
    status: RecordStatus,
  ): Promise<Track | null> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      if (!track.running) {
        throw new Error(`Track with ID ${id} is not running`);
      }

      if (track.entryId === null) {
        throw new Error(`Track with ID ${id} has no entry assigned`);
      }

      if (track.startTime === null || track.startTime === 0) {
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
        {
          alreadyStarted: this.configService.getConfig().options
            .blockEntryAfterRun
            ? true
            : false,
        },
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
      await this.appComModule.updateClientsData();
      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }

  async pauseTrack(id: string): Promise<Track | null> {
    const track = this.tracks.find((track) => track.id === id);
    if (track) {
      if (!track.running) {
        throw new Error(`Track with ID ${id} is not running`);
      }

      track.running = false;
      track.startTime = null;
      track.prevDuration = null;
      await this.appComModule.updateClientsData();
      return track;
    }
    throw new NotFoundException(`Track with ID ${id} not found`);
  }
}
