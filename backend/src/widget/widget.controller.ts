import { Controller, Get, Param } from '@nestjs/common';
import { WidgetService } from './widget.service';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  /**
   * GET /widget/:orgId/config
   * Javni endpoint — ne zahteva JWT.
   * Widget ga poziva pri učitavanju da zna naziv i jezik organizacije.
   */
  @Get(':orgId/config')
  getConfig(@Param('orgId') orgId: string) {
    return this.widgetService.getWidgetConfig(orgId);
  }
}
