import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import * as fs from 'node:fs';

@Injectable()
export class SummarizationService {
  constructor(private readonly prisma: PrismaService) {}

  async summarizeDocuments() {
    const documents = await this.prisma.document.findMany({
      where: {
        summary: null,
      },
    });

    for (const doc of documents) {
      const summary = await this.generateSummary(doc.filePath);

      await this.prisma.document.update({
        where: { id: doc.id },
        data: { summary },
      });
    }
  }

  async generateSummary(filePath: any): Promise<string> {
    const client = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });

    client.files.create({
      file: fs.createReadStream(filePath, 'utf8'),
      purpose: 'assistants',
    });
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Summarize the attached file in max 40 words:\n\n',
        },
      ],
      model: 'gpt-4',
    });

    return (
      chatCompletion.choices[0]?.message?.content || 'No summary generated.'
    );
  }
}
