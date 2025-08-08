import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { ResultsService } from './results.service';
import GenerateResultsToCsvDto from './dto/generate-results-to-csv.dto';
import { createReadStream } from 'fs';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post('export-to-csv')
  async exportToCsv(@Body() body: GenerateResultsToCsvDto) {
    const { filePath, fileName } =
      await this.resultsService.exportResultsToCSV(body);

    const file = createReadStream(filePath);

    console.log(`Exported results to CSV: ${fileName}`);

    return new StreamableFile(file, {
      type: 'text/csv',
      disposition: `attachment; filename="${fileName}"`,
    });
  }
}
