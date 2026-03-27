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
      .select('id, name, industry, primary_language, widget_accent_color, widget_position, widget_placeholder_text, widget_button_text')
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
      accent_color: data.widget_accent_color ?? '#6366F1',
      position: data.widget_position ?? 'bottom-right',
      placeholder_text: data.widget_placeholder_text ?? 'How can we help you today?',
      button_text: data.widget_button_text ?? 'Send message',
    };
  }
}
