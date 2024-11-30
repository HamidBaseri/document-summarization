import { Controller, Post } from '@nestjs/common';
import { SummarizationService } from './summarization.service';

@Controller('summarization')
export class SummarizationController {
  constructor(private readonly summarizationService: SummarizationService) {}

  @Post()
  async triggerSummarization() {
    return await this.summarizationService.summarizeDocuments();
  }
}
