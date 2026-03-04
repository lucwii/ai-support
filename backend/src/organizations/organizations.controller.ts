import { Controller, Post, Body } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private orgService: OrganizationsService) {}

  @Post()
  create(@Body() body: any) {
    return this.orgService.create(body.name, body.plan);
  }
}