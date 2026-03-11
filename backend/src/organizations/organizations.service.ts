import {
  Injectable,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import type { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Kreira organizaciju i automatski dodaje korisnika kao owner-a.
   *
   * Zašto dve operacije?
   * organizations tabela zna naziv firme i ko je vlasnik.
   * organization_members tabela zna koji user pripada kojoj org i sa kojom rolom.
   * Obe su potrebne da bi sistem znao "koji dashboard da pokaže ovom useru".
   */
  async createOrganization(userId: string, dto: CreateOrganizationDto) {
    this.logger.log(`Creating organization "${dto.name}" for user: ${userId}`);

    // Proveravamo da user već nema organizaciju
    // Jedan user = jedna organizacija za sada
    const { data: existingMember } = await this.supabaseService.db
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      throw new ConflictException('User already belongs to an organization');
    }

    // Korak 1: Kreiraj organizaciju
    const { data: organization, error: orgError } = await this.supabaseService.db
      .from('organizations')
      .insert({
        name: dto.name,
        industry: dto.industry,
        primary_language: dto.primary_language,
        team_size: dto.team_size ?? null,
        monthly_tickets: dto.monthly_tickets ?? null,
        website: dto.website ?? null,
        owner_id: userId,
      })
      .select()
      .single();

    if (orgError || !organization) {
      this.logger.error(`Failed to create organization: ${orgError?.message}`);
      throw new Error(`Failed to create organization: ${orgError?.message}`);
    }

    // Korak 2: Dodaj korisnika kao owner-a
    const { error: memberError } = await this.supabaseService.db
      .from('organization_members')
      .insert({
        user_id: userId,
        organization_id: organization.id,
        role: 'owner',
      });

    if (memberError) {
      this.logger.error(`Failed to create member: ${memberError.message}`);

      // Rollback – obrišemo organizaciju ako member insert nije uspeo
      await this.supabaseService.db
        .from('organizations')
        .delete()
        .eq('id', organization.id);

      throw new Error(`Failed to create organization member: ${memberError.message}`);
    }

    this.logger.log(`Organization created: ${organization.id}`);

    return organization;
  }

  /**
   * Vraća organizaciju za datog korisnika.
   * Koristi se u middleware-u i controlleru da proveri
   * da li je korisnik završio onboarding.
   */
  async getOrganizationByUserId(userId: string) {
    const { data, error } = await this.supabaseService.db
      .from('organization_members')
      .select(`
        role,
        organizations (
          id,
          name,
          owner_id,
          created_at
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    return {
      ...(data.organizations as any),
      role: data.role,
    };
  }
}