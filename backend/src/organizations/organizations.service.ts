import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrganizationsService {
  constructor(private supabase: SupabaseService) {}

  async create(name: string, plan: string) {
    const { data, error } = await this.supabase.db
      .from('organizations')
      .insert([{ name, plan }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}