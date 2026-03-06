import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './dto/tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  
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

  
  @Get()
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
}