import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { SupabaseModule } from '../supabase/supabase.module';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [SupabaseModule],
  providers: [AuthGuard, Reflector],
  exports: [AuthGuard],
})
export class AuthModule {}
