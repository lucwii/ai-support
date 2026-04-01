import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [SupabaseModule, AuthModule, OrganizationsModule],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
