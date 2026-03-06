import { IsString, IsUUID, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  organization_id: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsString()
  customer_email?: string;
}