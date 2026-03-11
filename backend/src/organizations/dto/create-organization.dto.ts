import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum Industry {
  SAAS = 'saas',
  ECOMMERCE = 'ecommerce',
  HEALTHCARE = 'healthcare',
  FINTECH = 'fintech',
  EDUCATION = 'education',
  OTHER = 'other',
}

export enum TeamSize {
  XS = '1-10',
  SM = '11-50',
  MD = '51-200',
  LG = '201-500',
  XL = '500+',
}

export enum MonthlyTickets {
  LOW = '<100',
  MEDIUM = '100-500',
  HIGH = '500-2000',
  VERY_HIGH = '2000+',
}

export enum PrimaryLanguage {
  ENGLISH = 'english',
  BSCHR = 'bschr',
  GERMAN = 'german',
  FRENCH = 'french',
  SPANISH = 'spanish',
  OTHER = 'other',
}

export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEnum(Industry)
  industry: Industry;

  @IsEnum(PrimaryLanguage)
  primary_language: PrimaryLanguage;

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
