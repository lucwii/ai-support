import { Module } from '@nestjs/common';
import { TicketsService } from './dto/tickets.service';
import { TicketsController } from './tickets.controller';
import { AiAnswerModule } from '../ai-answer/ai-answer.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [SupabaseModule, AiAnswerModule, AuthModule, EmailModule, OrganizationsModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}