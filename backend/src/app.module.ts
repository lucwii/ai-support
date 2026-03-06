import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
import { AiModule } from './ai/ai.module';
import { SupabaseModule } from './supabase/supabase.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { AiAnswerModule } from './ai-answer/ai-answer.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [ConfigModule.forRoot(), AiModule, SupabaseModule, KnowledgeModule, AiAnswerModule, TicketsModule],
  controllers: [AppController, OrganizationsController],
  providers: [AppService, OrganizationsService],
})
export class AppModule {}
