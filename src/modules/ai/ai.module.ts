import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { GoogleGenAI } from '@google/genai';
import { ArticlesService } from '../articles/articles.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    ArticlesService,
    PrismaService,
    {
      provide: GoogleGenAI,
      useFactory: () => {
        return new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
      },
    },
  ],
})
export class AiModule {}
