import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdatePreferencesDto {
  @IsOptional()
  @IsBoolean()
  email_on_new_ticket?: boolean;

  @IsOptional()
  @IsBoolean()
  email_on_low_confidence?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  ai_confidence_threshold?: number;
}
