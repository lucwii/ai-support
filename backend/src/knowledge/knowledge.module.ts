import { Module } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { AiModule } from '../ai/ai.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    AiModule,       // da možemo inject-ovati AiService
    SupabaseModule, // da možemo inject-ovati SupabaseService
  ],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}