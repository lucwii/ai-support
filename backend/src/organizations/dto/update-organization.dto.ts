import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import {
  Industry,
  TeamSize,
  MonthlyTickets,
  PrimaryLanguage,
} from './create-organization.dto';

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(Industry)
  industry?: Industry;

  @IsOptional()
  @IsEnum(PrimaryLanguage)
  primary_language?: PrimaryLanguage;

  @IsOptional()
  @IsEnum(TeamSize)
  team_size?: TeamSize;

  @IsOptional()
  @IsEnum(MonthlyTickets)
  monthly_tickets?: MonthlyTickets;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;
}
