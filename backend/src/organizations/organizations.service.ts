import {
  Injectable,
  Logger,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import type { CreateOrganizationDto } from './dto/create-organization.dto';
import type { UpdateOrganizationDto } from './dto/update-organization.dto';
import type { UpdatePreferencesDto } from './dto/update-preferences.dto';
import type { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly emailService: EmailService,
  ) {}

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

    // Korak 2: Dodaj korisnika kao owner-a + sačuvaj email za prikaz
    const { data: authUser } = await this.supabaseService.db.auth.admin.getUserById(userId);
    const ownerEmail = authUser?.user?.email ?? null;
    const ownerName = authUser?.user?.user_metadata?.full_name
      ?? authUser?.user?.user_metadata?.name
      ?? null;

    const { error: memberError } = await this.supabaseService.db
      .from('organization_members')
      .insert({
        user_id: userId,
        organization_id: organization.id,
        role: 'owner',
        email: ownerEmail,
        full_name: ownerName,
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
   * Uključuje sve kolone (industry, website, preferences itd.)
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
          industry,
          primary_language,
          team_size,
          monthly_tickets,
          website,
          email_on_new_ticket,
          email_on_low_confidence,
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

  /**
   * Update osnovnih podataka organizacije.
   * Samo owner ili admin mogu da menjaju.
   */
  async updateOrganization(userId: string, dto: UpdateOrganizationDto) {
    const org = await this.getOrganizationByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');
    if (org.role !== 'owner' && org.role !== 'admin') {
      throw new ForbiddenException('Only owner or admin can update organization');
    }

    const { data, error } = await this.supabaseService.db
      .from('organizations')
      .update({
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.industry !== undefined && { industry: dto.industry }),
        ...(dto.primary_language !== undefined && { primary_language: dto.primary_language }),
        ...(dto.team_size !== undefined && { team_size: dto.team_size }),
        ...(dto.monthly_tickets !== undefined && { monthly_tickets: dto.monthly_tickets }),
        ...(dto.website !== undefined && { website: dto.website }),
      })
      .eq('id', org.id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to update organization: ${error.message}`);
      throw new Error(`Failed to update organization: ${error.message}`);
    }

    return data;
  }

  /**
   * Vraća listu članova organizacije.
   */
  async getMembers(userId: string) {
    const org = await this.getOrganizationByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');

    const { data, error } = await this.supabaseService.db
      .from('organization_members')
      .select('id, user_id, role, email, full_name, created_at')
      .eq('organization_id', org.id)
      .order('created_at', { ascending: true });

    if (error) {
      this.logger.error(`Failed to get members: ${error.message}`);
      throw new Error(`Failed to get members: ${error.message}`);
    }

    // Dohvati i pending invite-ove
    const { data: invites } = await this.supabaseService.db
      .from('organization_invites')
      .select('id, email, role, status, created_at')
      .eq('organization_id', org.id)
      .eq('status', 'pending');

    return {
      members: data ?? [],
      pending_invites: invites ?? [],
    };
  }

  /**
   * Pozovi novog agenta u organizaciju emailom.
   * Koristi Supabase admin invite koji šalje email sa magic linkom.
   */
  async inviteMember(userId: string, dto: InviteMemberDto) {
    const org = await this.getOrganizationByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');
    if (org.role !== 'owner' && org.role !== 'admin') {
      throw new ForbiddenException('Only owner or admin can invite members');
    }

    // Provjeri da li je email već član
    const { data: existingMember } = await this.supabaseService.db
      .from('organization_members')
      .select('id')
      .eq('organization_id', org.id)
      .eq('email', dto.email)
      .single();

    if (existingMember) {
      throw new ConflictException('This email is already a member of this organization');
    }

    // Upsert invite record (da izbjegnemo duplikate ako se ponovo šalje)
    const { error: inviteRecordError } = await this.supabaseService.db
      .from('organization_invites')
      .upsert(
        {
          organization_id: org.id,
          email: dto.email,
          role: dto.role,
          status: 'pending',
          invited_by: userId,
        },
        { onConflict: 'organization_id,email' },
      );

    if (inviteRecordError) {
      this.logger.error(`Failed to save invite: ${inviteRecordError.message}`);
      throw new Error(`Failed to save invite: ${inviteRecordError.message}`);
    }

    // Supabase admin invite — kreira user nalog i šalje email sa magic linkom
    // Metadata se prenosi u user_metadata i koristi se u auth callbacku za join
    const { error: supabaseInviteError } = await this.supabaseService.db.auth.admin.inviteUserByEmail(
      dto.email,
      {
        data: {
          invited_org_id: org.id,
          invited_org_name: org.name,
          invited_role: dto.role,
        },
      },
    );

    if (supabaseInviteError) {
      this.logger.error(`Supabase invite failed: ${supabaseInviteError.message}`);
      // Ne bacamo error — invite record je sačuvan, može se ponovo pokušati
    }

    this.logger.log(`Invite sent to ${dto.email} for org ${org.id}`);

    return { email: dto.email, role: dto.role, status: 'pending' };
  }

  /**
   * Ukloni člana iz organizacije.
   * Owner ne može biti uklonjen.
   */
  async removeMember(requesterId: string, targetUserId: string) {
    const org = await this.getOrganizationByUserId(requesterId);
    if (!org) throw new NotFoundException('Organization not found');
    if (org.role !== 'owner' && org.role !== 'admin') {
      throw new ForbiddenException('Only owner or admin can remove members');
    }

    // Provjeri da se owner ne uklanja
    const { data: targetMember } = await this.supabaseService.db
      .from('organization_members')
      .select('role')
      .eq('organization_id', org.id)
      .eq('user_id', targetUserId)
      .single();

    if (!targetMember) throw new NotFoundException('Member not found');
    if (targetMember.role === 'owner') {
      throw new ForbiddenException('Cannot remove the organization owner');
    }

    const { error } = await this.supabaseService.db
      .from('organization_members')
      .delete()
      .eq('organization_id', org.id)
      .eq('user_id', targetUserId);

    if (error) {
      this.logger.error(`Failed to remove member: ${error.message}`);
      throw new Error(`Failed to remove member: ${error.message}`);
    }

    return { removed: true };
  }

  /**
   * Dohvati notifikacijske preference organizacije.
   */
  async getPreferences(userId: string) {
    const org = await this.getOrganizationByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');

    return {
      email_on_new_ticket: org.email_on_new_ticket ?? true,
      email_on_low_confidence: org.email_on_low_confidence ?? true,
    };
  }

  /**
   * Update notifikacijskih preferencija.
   */
  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const org = await this.getOrganizationByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');
    if (org.role !== 'owner' && org.role !== 'admin') {
      throw new ForbiddenException('Only owner or admin can update preferences');
    }

    const { data, error } = await this.supabaseService.db
      .from('organizations')
      .update({
        ...(dto.email_on_new_ticket !== undefined && { email_on_new_ticket: dto.email_on_new_ticket }),
        ...(dto.email_on_low_confidence !== undefined && { email_on_low_confidence: dto.email_on_low_confidence }),
      })
      .eq('id', org.id)
      .select('email_on_new_ticket, email_on_low_confidence')
      .single();

    if (error) {
      this.logger.error(`Failed to update preferences: ${error.message}`);
      throw new Error(`Failed to update preferences: ${error.message}`);
    }

    return data;
  }

  /**
   * Prihvati invite i dodaj korisnika u organizaciju.
   * Poziva se iz auth callbacka na frontendu kada korisnik prihvati invite.
   */
  async acceptInvite(userId: string, orgId: string) {
    // Dohvati invite
    const { data: authUser } = await this.supabaseService.db.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;
    if (!email) throw new ForbiddenException('User email not found');

    const { data: invite, error: inviteError } = await this.supabaseService.db
      .from('organization_invites')
      .select('role')
      .eq('organization_id', orgId)
      .eq('email', email)
      .eq('status', 'pending')
      .single();

    if (inviteError || !invite) {
      throw new NotFoundException('No pending invite found for this email and organization');
    }

    // Dodaj kao member
    const { error: memberError } = await this.supabaseService.db
      .from('organization_members')
      .insert({
        user_id: userId,
        organization_id: orgId,
        role: invite.role,
        email,
        full_name: authUser?.user?.user_metadata?.full_name ?? null,
      });

    if (memberError) {
      // Može biti da je već član (race condition)
      if (memberError.code === '23505') {
        throw new ConflictException('Already a member of this organization');
      }
      throw new Error(`Failed to accept invite: ${memberError.message}`);
    }

    // Označi invite kao accepted
    await this.supabaseService.db
      .from('organization_invites')
      .update({ status: 'accepted' })
      .eq('organization_id', orgId)
      .eq('email', email);

    this.logger.log(`User ${userId} accepted invite to org ${orgId}`);

    return { joined: true, role: invite.role };
  }
}
