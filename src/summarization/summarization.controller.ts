import { Controller } from '@nestjs/common';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

@Controller('summarization')
export class SummarizationController {
  async summarizeText(text: string) {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'user', content: 'Summarize the following text:\n\n' + text },
      ],
      model: 'gpt-4o',
    });

    return chatCompletion.choices[0];
  }
}
