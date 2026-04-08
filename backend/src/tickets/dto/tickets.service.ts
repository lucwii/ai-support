import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AiAnswerService } from 'src/ai-answer/ai-answer.service';
import { EmailService } from 'src/email/email.service';
import { CreateTicketDto } from './create-ticket.dto';
import { UpdateTicketDto } from './update-ticket.dto';

export type TicketStatus = 'processing' | 'auto_answered' | 'pending_agent' | 'resolved';

export interface Ticket {
  id: string;
  organization_id: string;
  content: string;
  ai_response: string | null;
  agent_response: string | null;
  confidence: number | null;
  status: TicketStatus;
  customer_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketResult {
  ticket: Ticket;
  wasAutoAnswered: boolean;
}

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly aiAnswerService: AiAnswerService,
    private readonly emailService: EmailService,
  ) {}

  async createTicket(dto: CreateTicketDto): Promise<CreateTicketResult> {
    this.logger.log(`Creating ticket for org: ${dto.organization_id}`);

    const { data: newTicket, error: insertError } = await this.supabaseService.db
      .from('tickets')
      .insert({
        organization_id: dto.organization_id,
        content: dto.content,
        customer_email: dto.customer_email ?? null,
        status: 'processing',
        ai_response: null,
        confidence: null,
      })
      .select()
      .single();

    if (insertError || !newTicket) {
      this.logger.error(`Failed to create ticket: ${insertError?.message}`);
      throw new Error(`Failed to create ticket: ${insertError?.message}`);
    }

    const aiResult = await this.aiAnswerService.generateAnswer(
      dto.organization_id,
      dto.content,
    );

    const status = this.aiAnswerService.determineTicketStatus(aiResult.confidence);

    this.logger.log(
      `Ticket ${newTicket.id} → confidence: ${aiResult.confidence}% → status: "${status}"`,
    );

    const { data: updatedTicket, error: updateError } = await this.supabaseService.db
      .from('tickets')
      .update({
        ai_response: aiResult.answer,
        confidence: aiResult.confidence,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', newTicket.id)
      .select()
      .single();

    if (updateError || !updatedTicket) {
      this.logger.error(`Failed to update ticket: ${updateError?.message}`);
      throw new Error(`Failed to update ticket: ${updateError?.message}`);
    }

    await this.writeTicketLog({
      ticketId: newTicket.id,
      organizationId: dto.organization_id,
      action: 'ai_response_generated',
      message: `AI generated response with confidence ${aiResult.confidence}%. Status set to "${status}".`,
      metadata: {
        confidence: aiResult.confidence,
        status,
        sourcesCount: aiResult.sources.length,
        hasRelevantContext: aiResult.hasRelevantContext,
      },
    });

    const orgInfo = await this.getOrganizationPreferences(dto.organization_id);

    if (status === 'auto_answered' && dto.customer_email) {
      await this.emailService.sendTicketResolvedEmail({
        to: dto.customer_email,
        ticketContent: dto.content,
        response: aiResult.answer,
        organizationName: orgInfo?.name ?? 'Support Team',
      });
    }

    if (orgInfo?.email_on_new_ticket && orgInfo.ownerEmail) {
      await this.emailService.sendNewTicketNotification({
        to: orgInfo.ownerEmail,
        ticketContent: dto.content,
        ticketId: newTicket.id,
        organizationName: orgInfo.name,
      });
    }

    // Notifikacija owneru — AI nije siguran, treba human review
    if (status === 'pending_agent' && orgInfo?.email_on_low_confidence && orgInfo.ownerEmail) {
      await this.emailService.sendLowConfidenceNotification({
        to: orgInfo.ownerEmail,
        ticketContent: dto.content,
        aiResponse: aiResult.answer,
        confidence: aiResult.confidence,
        ticketId: newTicket.id,
        organizationName: orgInfo.name,
      });
    }

    return {
      ticket: updatedTicket as Ticket,
      wasAutoAnswered: status === 'auto_answered',
    }
  }

  async getPublicTicketById(ticketId: string): Promise<Pick<Ticket, 'id' | 'content' | 'status' | 'ai_response' | 'agent_response' | 'created_at'>> {
    const { data: ticket, error } = await this.supabaseService.db
      .from('tickets')
      .select('id, content, status, ai_response, agent_response, created_at')
      .eq('id', ticketId)
      .single();

    if (error || !ticket) {
      throw new NotFoundException(`Ticket ${ticketId} not found`);
    }

    return ticket;
  }

  async getTickets(organizationId: string): Promise<Ticket[]> {
    const { data, error } = await this.supabaseService.db
      .from('tickets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error(`Failed to fetch tickets: ${error.message}`);
      throw new Error(`Failed to fetch tickets: ${error.message}`);
    }

    return (data ?? []) as Ticket[];
  }

  async getTicketById(
    ticketId: string,
    organizationId: string,
  ): Promise<{ ticket: Ticket; logs: any[] }> {
    const { data: ticket, error } = await this.supabaseService.db
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('organization_id', organizationId)
      .single();

    if (error || !ticket) {
      throw new NotFoundException(`Ticket ${ticketId} not found`);
    }

    const { data: logs } = await this.supabaseService.db
      .from('ticket_logs')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    return {
      ticket: ticket as Ticket,
      logs: logs ?? [],
    };
  }

  async updateTicket(
    ticketId: string,
    organizationId: string,
    organizationName: string,
    dto: UpdateTicketDto,
  ): Promise<Ticket> {
    const { data: existing, error: fetchError } = await this.supabaseService.db
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('organization_id', organizationId)
      .single();

    if (fetchError || !existing) {
      throw new NotFoundException(`Ticket ${ticketId} not found`);
    }

    const updatePayload: Record<string, any> = {
      status: dto.status,
      updated_at: new Date().toISOString(),
    };

    if (dto.agent_response) {
      updatePayload.agent_response = dto.agent_response;
    }

    const { data: updated, error: updateError } = await this.supabaseService.db
      .from('tickets')
      .update(updatePayload)
      .eq('id', ticketId)
      .eq('organization_id', organizationId)
      .select('*')
      .single();

    if (updateError || !updated) {
      throw new InternalServerErrorException('Failed to update ticket');
    }

    await this.writeTicketLog({
      ticketId,
      organizationId,
      action: 'agent_resolved',
      message: dto.agent_response
        ? 'Agent sent a custom response'
        : 'Agent resolved the ticket',
      metadata: {
        previous_status: existing.status,
        new_status: dto.status,
        has_agent_response: !!dto.agent_response,
      },
    });

    // Send email to customer when ticket is resolved
    if (dto.status === 'resolved' && existing.customer_email) {
      const responseText =
        dto.agent_response ?? existing.ai_response ?? 'Your ticket has been resolved.';

      await this.emailService.sendTicketResolvedEmail({
        to: existing.customer_email,
        ticketContent: existing.content,
        response: responseText,
        organizationName,
      });
    }

    return updated as Ticket;
  }

  async assignTicket(
    ticketId: string,
    organizationId: string,
    assignedTo: string | null
  ): Promise<Ticket> {
    const {data: existing, error: fetchError} = await this.supabaseService.db
      .from('tickets')
      .select('id')
      .eq('id', ticketId)
      .eq('organization_id', organizationId)
      .single();

      if(fetchError || !existing) {
        throw new NotFoundException(`Ticket ${ticketId} not found`);
      }

    const {data: updated, error: updatedError} = await this.supabaseService.db
      .from('tickets')
      .update({
        assigned_to: assignedTo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
      .eq('organization_id', organizationId)
      .select('*')
      .single();

    if(updatedError || !updated) {
      throw new InternalServerErrorException(`Failed to assign ticket: ${updatedError?.message}`);
    }

    await this.writeTicketLog({
      ticketId,
      organizationId,
      action: 'ticket_assigned',
      message: assignedTo ? `Ticket assigned to user ${assignedTo}` : 'Ticket unassigned',
      metadata: {
        assigned_to: assignedTo,
      },
    })

    return updated as Ticket;
  }

  private async writeTicketLog(params: {
    ticketId: string;
    organizationId: string;
    action: string;
    message: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { error } = await this.supabaseService.db.from('ticket_logs').insert({
      ticket_id: params.ticketId,
      organization_id: params.organizationId,
      action: params.action,
      message: params.message,
      metadata: params.metadata ?? {},
    });

    if (error) {
      this.logger.error(`Failed to write ticket log: ${error.message}`);
    }
  }

  private async getOrganizationPreferences(organizationId: string): Promise<{
    name: string;
    ownerEmail: string | null;
    email_on_new_ticket: boolean;
    email_on_low_confidence: boolean;
  } | null> {
    const {data: org} = await this.supabaseService.db
      .from('organizations')
      .select('name, email_on_new_ticket, email_on_low_confidence')
      .eq('id', organizationId)
      .single();

    if (!org) {
      this.logger.warn(`[notifications] org not found for id: ${organizationId}`);
      return null;
    }

    const {data: owner} = await this.supabaseService.db
      .from('organization_members')
      .select('email, user_id')
      .eq('organization_id', organizationId)
      .eq('role', 'owner')
      .single();

    if (!owner) {
      this.logger.warn(`[notifications] owner member not found for org: ${organizationId}`);
      return null;
    }

    let ownerEmail = owner.email ?? null;

    if (!ownerEmail) {
      const { data: authUser } = await this.supabaseService.db.auth.admin.getUserById(owner.user_id);
      ownerEmail = authUser?.user?.email ?? null;
      this.logger.log(`[notifications] email fetched from auth.users: ${ownerEmail}`);
    }

    this.logger.log(`[notifications] org: ${org.name}, ownerEmail: ${ownerEmail}, new_ticket: ${org.email_on_new_ticket}, low_confidence: ${org.email_on_low_confidence}`);

    return {
      name: org.name,
      ownerEmail,
      email_on_new_ticket: org.email_on_new_ticket,
      email_on_low_confidence: org.email_on_low_confidence,
    }
  }
}
