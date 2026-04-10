import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './dto/tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.types';
import { OrganizationsService } from '../organizations/organizations.service';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { SetPriorityDto } from './dto/set-priority.dto';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTicket(@Body() dto: CreateTicketDto) {
    const result = await this.ticketsService.createTicket(dto);

    return {
      success: true,
      data: {
        ticket: result.ticket,
        wasAutoAnswered: result.wasAutoAnswered,
        message: result.wasAutoAnswered
          ? 'Your question was answered automatically.'
          : 'Your ticket has been created and will be reviewed by an agent.',
      },
    };
  }

  @Get('public/:id')
  async getPublicTicketById(@Param('id') id: string) {
    const ticket = await this.ticketsService.getPublicTicketById(id);

    return {
      success: true,
      data: ticket,
    };
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTickets(@Query('organization_id') organizationId: string) {
    if (!organizationId) {
      throw new BadRequestException('organization_id query param is required');
    }

    const tickets = await this.ticketsService.getTickets(organizationId);

    return {
      success: true,
      data: tickets,
      total: tickets.length,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getTicketById(
    @Param('id') id: string,
    @Query('organization_id') organizationId: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('organization_id query param is required');
    }

    const result = await this.ticketsService.getTicketById(id, organizationId);

    return {
      success: true,
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateTicket(
    @Param('id') ticketId: string,
    @Body() dto: UpdateTicketDto,
    @GetUser() user: JwtPayload,
  ) {
    const organization = await this.organizationsService.getOrganizationByUserId(user.sub);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const ticket = await this.ticketsService.updateTicket(
      ticketId,
      organization.id,
      organization.name,
      dto,
    );

    return {
      success: true,
      data: ticket,
    };
  }

  @Patch(':id/assign')
  @UseGuards(AuthGuard)
  async assignTicket(
    @Param('id') ticketId: string,
    @Body() dto: AssignTicketDto,
    @GetUser() user: JwtPayload,
  ) {
    const organization = await this.organizationsService.getOrganizationByUserId(user.sub);

    if(!organization) {
      throw new NotFoundException('Organization not found');
    }

    const ticket = await this.ticketsService.assignTicket(
      ticketId,
      organization.id,
      dto.assigned_to || null,
    )

    return {
      success: true,
      data: ticket,
    }
  }

  @Patch(':id/priority')
  @UseGuards(AuthGuard)
  async updateTicketPriority(
    @Param('id') ticketId: string,
    @Body() dto: SetPriorityDto,
    @GetUser() user: JwtPayload,
  ) {
    const organization = await this.organizationsService.getOrganizationByUserId(user.sub);

    if(!organization) {
      throw new NotFoundException('Organization not found');
    }

    const ticket = await this.ticketsService.setPriority(
      ticketId,
      organization.id,
      dto.priority,
    )

    return {
      success: true,
      data: ticket,
    }
  }
}