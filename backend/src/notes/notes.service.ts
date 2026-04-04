import { Injectable, Logger } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";

export interface Note {
    id: string;
    ticket_id: string;
    organization_id: string;
    author_id: string;
    author_name: string;
    content: string;
    created_at: string;
}

@Injectable()
export class NotesService {
    private readonly logger = new Logger(NotesService.name);

    constructor(
        private readonly supabaseService: SupabaseService,
    ){}

    async getTicketNotes(ticketId: string, organizationId: string): Promise<Note[]> {
        this.logger.log(`Fetching notes for ticket ${ticketId} in org ${organizationId}`);

        const {data, error} = await this.supabaseService.db
            .from('ticket_notes')
            .select('*')
            .eq('ticket_id', ticketId)
            .eq('organization_id', organizationId)
            .order('created_at', { ascending: true });

        if(error) {
            this.logger.error(`Error fetching notes: ${error.message}`);
            throw new Error(`Error fetching notes: ${error.message}`);
        }

        return (data ?? []) as Note[];
    }

    async createTicketNote(ticketId: string, organizationId: string, authorId: string, content: string) {
        this.logger.log(`Creating note for ticket ${ticketId} in org ${organizationId} by author ${authorId}`);

        const {data: ticket, error: ticketError} = await this.supabaseService.db
            .from('tickets')
            .select('*')
            .eq('id', ticketId)
            .eq('organization_id', organizationId)
            .single();

        if(ticketError || !ticket) {
            this.logger.error(`Ticket not found: ${ticketError?.message}`);
            throw new Error(`Ticket not found: ${ticketError?.message}`);
        }


        const {data: author, error: authorError} = await this.supabaseService.db 
            .from('organization_members')
            .select('*')
            .eq('organization_id', organizationId)
            .eq('user_id', authorId)
            .single();

        if(authorError || !author) {
            this.logger.error(`Author not found: ${authorError?.message}`);
            throw new Error(`Author not found: ${authorError?.message}`);
        }

        const {data: newNote, error: noteError} = await this.supabaseService.db
            .from('ticket_notes')
            .insert({
                ticket_id: ticketId,
                organization_id: organizationId,
                author_id: authorId,
                author_name: author.full_name ?? author.email ?? 'Agent',
                content,
            })
            .select('*')
            .single();

        if(noteError || !newNote) {
            this.logger.error(`Error creating note: ${noteError?.message}`);
            throw new Error(`Error creating note: ${noteError?.message}`);
        }

        return newNote as Note;
    }

    async deleteTicketNote(noteId: string, ticketId: string, organizationId: string) {
        this.logger.log(`Deleting note ${noteId} for ticket ${ticketId}`);

        const {data: note, error: noteError} = await this.supabaseService.db
            .from('ticket_notes')
            .delete()
            .eq('id', noteId)
            .eq('ticket_id', ticketId)
            .eq('organization_id', organizationId)
            .select('*')
            .single();

        if(noteError || !note) {
            this.logger.error(`Error deleting note: ${noteError?.message}`);
            throw new Error(`Error deleting note: ${noteError?.message}`);
        }
    }

    async updateTicketNote(noteId: string, ticketId: string, organizationId: string, content: string) {
        this.logger.log(`Updating note ${noteId} for ticket ${ticketId}`);

        const {data: note, error: noteError} = await this.supabaseService.db
            .from('ticket_notes')
            .select('*')
            .eq('id', noteId)
            .eq('ticket_id', ticketId)
            .eq('organization_id', organizationId)
            .single();

        if(noteError || !note) {
            this.logger.error(`Error updating note: ${noteError?.message}`);
            throw new Error(`Error updating note: ${noteError?.message}`);
        }

        const {data: updatedNote, error: updateError} = await this.supabaseService.db
            .from('ticket_notes')
            .update({ content })
            .eq('id', noteId)
            .eq('ticket_id', ticketId)
            .eq('organization_id', organizationId)
            .select('*')
            .single();

        if(updateError || !updatedNote) {
            this.logger.error(`Error updating note: ${updateError?.message}`);
            throw new Error(`Error updating note: ${updateError?.message}`);
        }

        return updatedNote as Note;
    }
}