import { Module } from '@nestjs/common';
import { TicketsService } from './dto/tickets.service'; 
import { TicketsController } from './tickets.controller';
import { AiAnswerModule } from '../ai-answer/ai-answer.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    AiAnswerModule,
    AuthModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}