import { Module } from '@nestjs/common';
import { AiAnswerService } from './ai-answer.service';
import { AiModule } from '../ai/ai.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';

@Module({
  imports: [
    AiModule,
    KnowledgeModule,
  ],
  providers: [AiAnswerService],
  exports: [AiAnswerService],
})
export class AiAnswerModule {}