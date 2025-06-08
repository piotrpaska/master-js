import { Injectable } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { Entry as EntryModel } from 'generated/prisma';
import { EntryService } from 'src/entry/entry.service';

@Injectable()
export class TrackService {
  constructor(private entryService: EntryService) {}

  private tracks: Track[] = [];

  createTrack(track: Track): Track {
    this.tracks.push(track);
    return track;
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
}
