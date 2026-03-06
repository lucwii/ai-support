import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { AiAnswerService } from 'src/ai-answer/ai-answer.service';
import { CreateTicketDto } from './create-ticket.dto';

export type TicketStatus = 'processing' | 'auto_answered' | 'pending_agent' | 'resolved';

export interface Ticket {
  id: string;
  organization_id: string;
  content: string;
  ai_response: string | null;
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
  ) {}

  
  async createTicket(dto: CreateTicketDto): Promise<CreateTicketResult> {
    this.logger.log(`Creating ticket for org: ${dto.organization_id}`);

    // ── Korak 1: Kreiraj tiket sa inicijalnim statusom "processing" ────────
    // Upisujemo odmah u bazu da imamo ID pre nego što AI završi
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

    this.logger.debug(`Ticket created with id: ${newTicket.id}`);

    // ── Korak 2: Pokreni kompletan AI pipeline ─────────────────────────────
    // generateAnswer interno radi:
    //   createEmbedding → findRelevantDocuments → generateResponse
    const aiResult = await this.aiAnswerService.generateAnswer(
      dto.organization_id,
      dto.content,
    );

    // ── Korak 3: Odluči status na osnovu confidence ────────────────────────
    const status = this.aiAnswerService.determineTicketStatus(aiResult.confidence);

    this.logger.log(
      `Ticket ${newTicket.id} → confidence: ${aiResult.confidence}% → status: "${status}"`,
    );

    // ── Korak 4: Ažuriraj tiket sa AI odgovorom ───────────────────────────
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

    // ── Korak 5: Upiši log u ticket_logs ──────────────────────────────────
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

    return {
      ticket: updatedTicket as Ticket,
      wasAutoAnswered: status === 'auto_answered',
    };
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

  async getTicketById(ticketId: string, organizationId: string): Promise<{
    ticket: Ticket;
    logs: any[];
  }> {
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

  // ── Privatne helper metode ─────────────────────────────────────────────────

  private async writeTicketLog(params: {
    ticketId: string;
    organizationId: string;
    action: string;
    message: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { error } = await this.supabaseService.db
      .from('ticket_logs')
      .insert({
        ticket_id: params.ticketId,
        organization_id: params.organizationId,
        action: params.action,
        message: params.message,
        metadata: params.metadata ?? {},
      });

    if (error) {
      // Log greška ali ne bacamo exception – log nije kritičan za flow
      this.logger.error(`Failed to write ticket log: ${error.message}`);
    }
  }
}