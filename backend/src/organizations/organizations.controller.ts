import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto'; 
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.types';

@Controller('organizations')
@UseGuards(AuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrganization(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateOrganizationDto,
  ) {
    const organization = await this.organizationsService.createOrganization(
      user.sub,
      dto.name,
    );

    return {
      success: true,
      data: organization,
    };
  }

  
  @Get('me')
  async getMyOrganization(@GetUser() user: JwtPayload) {
    const organization = await this.organizationsService.getOrganizationByUserId(
      user.sub,
    );

    return {
      success: true,
      data: organization, 
    };
  }
}