import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ResultsService } from './results.service';
import GenerateResultsToCsvDto from './dto/generate-results-to-csv.dto';
import { createReadStream } from 'fs';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  getResults() {
    return this.resultsService.getListOfResults();
  }

  @Get(':name')
  @Header('Access-Control-Expose-Headers', 'Content-Disposition')
  getResultById(@Param('name') name: string) {
    return this.resultsService.provideResultToDownload(name);
  }

  @Post('export-to-csv')
  @Header('Access-Control-Expose-Headers', 'Content-Disposition')
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

  @Delete(':name')
  deleteResult(@Param('name') name: string) {
    return this.resultsService.deleteResult(name);
  }
}
