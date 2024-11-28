import { Module } from '@nestjs/common';
import { SummarizationService } from './summarization.service';
import { SummarizationController } from './summarization.controller';

@Module({
  providers: [SummarizationService],
  controllers: [SummarizationController]
})
export class SummarizationModule {}
