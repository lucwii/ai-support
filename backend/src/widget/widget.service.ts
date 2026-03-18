import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class WidgetService {
  private readonly logger = new Logger(WidgetService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Vraća javnu konfiguraciju organizacije potrebnu za widget.
   * Ne zahteva autentifikaciju — widget se učitava na tuđim sajtovima.
   */
  async getWidgetConfig(orgId: string) {
    this.logger.log(`Fetching widget config for org: ${orgId}`);

    const { data, error } = await this.supabaseService.db
      .from('organizations')
      .select('id, name, industry, primary_language')
      .eq('id', orgId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Organization not found');
    }

    return {
      org_id: data.id,
      name: data.name,
      industry: data.industry,
      primary_language: data.primary_language,
    };
  }
}
