import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateWidgetSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  accent_color?: string;

  @IsOptional()
  @IsIn(['bottom-right', 'bottom-left'])
  position?: 'bottom-right' | 'bottom-left';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  placeholder_text?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  button_text?: string;
}
