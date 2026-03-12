import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum TicketStatus {
  PROCESSING = 'processing',
  AUTO_ANSWERED = 'auto_answered',
  PENDING_AGENT = 'pending_agent',
  RESOLVED = 'resolved',
}

export class UpdateTicketDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @IsOptional()
  @IsString()
  @MinLength(1)
  agent_response?: string;
}