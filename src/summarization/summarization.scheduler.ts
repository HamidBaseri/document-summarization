import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SummarizationService } from './summarization.service';

@Injectable()
export class SummarizationScheduler {
  constructor(private readonly summarizationService: SummarizationService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleDocumentSummarization() {
    console.log('Running scheduled document summarization...');
    await this.summarizationService.summarizeDocuments();
    console.log('Document summarization task completed.');
  }
}
