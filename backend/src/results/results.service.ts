import { Injectable, StreamableFile } from '@nestjs/common';
import { RecordService } from 'src/record/record.service';
import GenerateResultsToCsvDto from './dto/generate-results-to-csv.dto';
import { RecordStatus, Session } from 'generated/prisma';
import { ConfigService } from 'src/config/config.service';
import { join } from 'node:path';
import * as fs from 'fs';
import { createReadStream, writeFileSync } from 'node:fs';
import { Record } from 'generated/prisma/runtime/library';

const headers = [
  'Rank',
  'Athlete',
  'Time',
  'Track',
  'Status',
  'start-time',
  'end-time',
  'timestamp',
  'record-id',
  'entry-id',
  'athlete-id',
  'start-list-id',
  'start-list-title',
];

interface CsvRecord {
  rank: number;
  athlete: string;
  time: string;
  track: string;
  status: string;
  startTime: string;
  endTime: string;
  timestamp: string;
  recordId: string;
  entryId: string;
  athleteId: string;
  sessionId: string;
  sessionTitle: string;
}

@Injectable()
export class ResultsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly recordService: RecordService,
  ) {}

  getListOfResults(): string[] {
    const files = fs.readdirSync(this.configService.getConfig().resultsDir);
    return files;
  }

  provideResultToDownload(name: string) {
    const filePath = join(this.configService.getConfig().resultsDir, name);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    const file = createReadStream(filePath);
    return new StreamableFile(file, {
      type: 'text/csv',
      disposition: `attachment; filename="${name}"`,
    });
  }

  async exportResultsToCSV(
    props: GenerateResultsToCsvDto,
  ): Promise<{ fileName: string; filePath: string }> {
    const { startListId, mode, fileName } = props;

    const recordsOfSession = (await this.recordService.records({
      where: { sessionId: startListId },
      orderBy: { duration: 'asc' },
      include: {
        entry: {
          include: {
            athlete: true,
          },
        },
        session: true,
      },
    })) as Array<{
      status: RecordStatus;
      id: string;
      sessionId: string;
      duration: bigint | null;
      trackId: string;
      timestamp: Date;
      startTime: bigint;
      endTime: bigint | null;
      track: string;
      entryId: string;
      entry: {
        athlete: {
          id: string;
          name: string;
        };
      };
      session: Session;
    }>;

    switch (mode) {
      case 'best': {
        const bestRecords = Object.values(
          recordsOfSession.reduce(
            (acc, record) => {
              const entryId = record.entryId;
              if (
                entryId !== undefined &&
                (!acc[entryId] ||
                  (record.duration !== null &&
                    (acc[entryId].duration === null ||
                      record.duration < acc[entryId].duration)))
              ) {
                acc[entryId] = record;
              }
              return acc;
            },
            {} as Record<string, (typeof recordsOfSession)[0]>,
          ),
        ).sort((a, b) => {
          if (a.duration === null && b.duration === null) return 0;
          if (a.duration === null) return 1;
          if (b.duration === null) return -1;
          return Number(a.duration) - Number(b.duration);
        });

        return this.generateCsvContent(
          bestRecords.map((record, index) => ({
            rank: index + 1,
            athlete: record.entry.athlete.name,
            time: record.duration ? String(record.duration) : 'N/A',
            track: record.track || 'N/A',
            status: record.status || 'N/A',
            startTime: record.startTime ? String(record.startTime) : 'N/A',
            endTime: record.endTime ? String(record.endTime) : 'N/A',
            timestamp: record.timestamp ? String(record.timestamp) : 'N/A',
            recordId: record.id,
            entryId: record.entryId,
            athleteId: record.entry.athlete.id,
            sessionId: record.sessionId,
            sessionTitle: record.session?.title,
          })),
          recordsOfSession[0]?.session || ({} as Session),
          fileName,
        );
      }
      case 'all': {
        return this.generateCsvContent(
          recordsOfSession.map((record, index) => ({
            rank: index + 1,
            athlete: record.entry.athlete.name,
            time: record.duration ? String(record.duration) : 'N/A',
            track: record.track || 'N/A',
            status: record.status || 'N/A',
            startTime: record.startTime ? String(record.startTime) : 'N/A',
            endTime: record.endTime ? String(record.endTime) : 'N/A',
            timestamp: record.timestamp ? String(record.timestamp) : 'N/A',
            recordId: record.id,
            entryId: record.entryId,
            athleteId: record.entry.athlete.id,
            sessionId: record.sessionId,
            sessionTitle: record.session?.title,
          })),
          recordsOfSession[0]?.session || ({} as Session),
          fileName,
        );
      }
      default: {
        throw new Error('Invalid mode specified');
      }
    }
  }

  generateCsvContent(
    data: CsvRecord[],
    session: Session,
    fileName?: string,
  ): { fileName: string; filePath: string } {
    let csvContent = headers.join(',') + '\r\n';

    console.log(fileName);

    data.forEach((record) => {
      const row = [
        record.rank,
        record.athlete,
        record.time,
        record.track,
        record.status,
        record.startTime,
        record.endTime,
        record.timestamp,
        record.recordId,
        record.entryId,
        record.athleteId,
        record.sessionId,
        record.sessionTitle,
      ].join(',');
      csvContent += row + '\r\n';
    });

    const dir = this.configService.getConfig().resultsDir || './results';

    // Ensure the directory exists before writing the file
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fileName) {
      // Replace colons and other invalid filename characters
      const safeDate = new Date().toISOString().replace(/[:]/g, '-');
      fileName = `results-${session.title}-${safeDate}.csv`;
    }

    const nameFile = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
    const filePath = join(dir, nameFile);

    console.log('Writing CSV file:', filePath);

    writeFileSync(filePath, csvContent, 'utf8');
    console.log('CSV file written successfully');
    console.log('CSV content generated:', csvContent);

    return {
      fileName: nameFile,
      filePath,
    };
  }

  deleteResult(name: string) {
    const dir = this.configService.getConfig().resultsDir || './results';
    const filePath = join(dir, name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted result file: ${filePath}`);
      return { success: true };
    } else {
      console.log(`Result file not found: ${filePath}`);
      return { success: false };
    }
  }
}
