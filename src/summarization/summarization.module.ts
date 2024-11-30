import { Module } from '@nestjs/common';
import { SummarizationService } from './summarization.service';
import { SummarizationController } from './summarization.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SummarizationService],
  controllers: [SummarizationController],
})
export class SummarizationModule {}
