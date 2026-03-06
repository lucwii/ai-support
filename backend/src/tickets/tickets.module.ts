import { Module } from '@nestjs/common';
import { TicketsService } from './dto/tickets.service'; 
import { TicketsController } from './tickets.controller';
import { AiAnswerModule } from '../ai-answer/ai-answer.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule,  // za direktan upis tiketa i logova
    AiAnswerModule,  // sadrži kompletan AI pipeline (Ticket 1–4)
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}