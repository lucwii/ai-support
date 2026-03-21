import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsModule } from './organizations/organizations.module';
import { AiModule } from './ai/ai.module';
import { SupabaseModule } from './supabase/supabase.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { AiAnswerModule } from './ai-answer/ai-answer.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { WidgetModule } from './widget/widget.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [ConfigModule.forRoot(), AiModule, SupabaseModule, KnowledgeModule, AiAnswerModule, TicketsModule, AuthModule, OrganizationsModule, WidgetModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
