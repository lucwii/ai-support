import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationsController } from './organizations/organizations.controller';
import { OrganizationsService } from './organizations/organizations.service';
import { SupabaseService } from './supabase/supabase.service';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [ConfigModule.forRoot(), AiModule],
  controllers: [AppController, OrganizationsController],
  providers: [AppService, OrganizationsService, SupabaseService],
})
export class AppModule {}
