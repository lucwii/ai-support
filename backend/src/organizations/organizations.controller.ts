import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateWidgetSettingsDto } from './dto/update-widget-settings.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/public.decorator';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.types';

@Controller('organizations')
@UseGuards(AuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('public/:slug')
  @Public()
  async getPublicOrganization(@Param('slug') slug: string) {
    return this.organizationsService.getPublicOrganizationBySlug(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateOrganizationDto,
  ) {
    const organization = await this.organizationsService.createOrganization(user.sub, dto);
    return { success: true, data: organization };
  }

  @Get('me')
  async getMyOrganization(@GetUser() user: JwtPayload) {
    const organization = await this.organizationsService.getOrganizationByUserId(user.sub);
    return { success: true, data: organization };
  }

  @Patch('me')
  async updateOrganization(
    @GetUser() user: JwtPayload,
    @Body() dto: UpdateOrganizationDto,
  ) {
    const organization = await this.organizationsService.updateOrganization(user.sub, dto);
    return { success: true, data: organization };
  }

  // ── Widget settings ───────────────────────────────────────────────────────

  @Patch('me/widget-settings')
  async updateWidgetSettings(
    @GetUser() user: JwtPayload,
    @Body() dto: UpdateWidgetSettingsDto,
  ) {
    const data = await this.organizationsService.updateWidgetSettings(user.sub, dto);
    return { success: true, data };
  }

  // ── Members ────────────────────────────────────────────────────────────────

  @Get('me/members')
  async getMembers(@GetUser() user: JwtPayload) {
    const data = await this.organizationsService.getMembers(user.sub);
    return { success: true, data };
  }

  @Post('me/members/invite')
  @HttpCode(HttpStatus.CREATED)
  async inviteMember(
    @GetUser() user: JwtPayload,
    @Body() dto: InviteMemberDto,
  ) {
    const data = await this.organizationsService.inviteMember(user.sub, dto);
    return { success: true, data };
  }

  @Delete('me/members/:userId')
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @GetUser() user: JwtPayload,
    @Param('userId') targetUserId: string,
  ) {
    const data = await this.organizationsService.removeMember(user.sub, targetUserId);
    return { success: true, data };
  }

  // ── Preferences ───────────────────────────────────────────────────────────

  @Get('me/preferences')
  async getPreferences(@GetUser() user: JwtPayload) {
    const data = await this.organizationsService.getPreferences(user.sub);
    return { success: true, data };
  }

  @Patch('me/preferences')
  async updatePreferences(
    @GetUser() user: JwtPayload,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const data = await this.organizationsService.updatePreferences(user.sub, dto);
    return { success: true, data };
  }

  // ── Invite accept ──────────────────────────────────────────────────────────

  @Post('accept-invite')
  @HttpCode(HttpStatus.OK)
  async acceptInvite(
    @GetUser() user: JwtPayload,
    @Body('org_id') orgId: string,
  ) {
    const data = await this.organizationsService.acceptInvite(user.sub, orgId);
    return { success: true, data };
  }
}
