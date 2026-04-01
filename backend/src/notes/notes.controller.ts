import { Controller, Get, Post, Param, Body, UseGuards, HttpCode, HttpStatus, NotFoundException } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateTicketNoteDto } from "./dto/create-ticket-note.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { GetUser } from "src/auth/get-user.decorator";
import type { JwtPayload } from "src/auth/types/jwt-payload.types";
import { OrganizationsService } from "src/organizations/organizations.service";

@Controller('notes')
export class NotesController {
    constructor(
        private readonly notesService: NotesService,
        private readonly organizationsService: OrganizationsService,
    ) {}

    @Get(':ticketId')
    @UseGuards(AuthGuard)
    async getTicketNotes(
        @Param('ticketId') ticketId: string,
        @GetUser() user: JwtPayload,
    ) {
        const organization = await this.organizationsService.getOrganizationByUserId(user.sub);

        if (!organization) {
            throw new NotFoundException('Organization not found');
        }

        const notes = await this.notesService.getTicketNotes(ticketId, organization.id);

        return { success: true, data: notes };
    }

    @Post(':ticketId')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createTicketNote(
        @Param('ticketId') ticketId: string,
        @Body() dto: CreateTicketNoteDto,
        @GetUser() user: JwtPayload,
    ) {
        const organization = await this.organizationsService.getOrganizationByUserId(user.sub);

        if (!organization) {
            throw new NotFoundException('Organization not found');
        }

        const note = await this.notesService.createTicketNote(ticketId, organization.id, user.sub, dto.content);

        return { success: true, data: note };
    }
}
