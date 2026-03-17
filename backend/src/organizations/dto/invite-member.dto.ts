import { IsEmail, IsEnum } from 'class-validator';

export enum MemberRole {
  AGENT = 'agent',
  ADMIN = 'admin',
}

export class InviteMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(MemberRole)
  role: MemberRole;
}
