import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  email_on_new_ticket?: boolean;

  @IsOptional()
  @IsBoolean()
  email_on_low_confidence?: boolean;
}
