import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.types';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * POST /payments/checkout
   * Kreira Lemon Squeezy checkout i vraća URL na koji frontend redirectuje korisnika.
   */
  @Post('checkout')
  @UseGuards(AuthGuard)
  async createCheckout(
    @GetUser() user: JwtPayload,
    @Body() dto: CreateCheckoutDto,
  ) {
    const data = await this.paymentsService.createCheckout(user.sub, dto.variant_id);
    return { success: true, data };
  }

  /**
   * GET /payments/portal
   * Vraća Lemon Squeezy customer portal URL za upravljanje pretplatom.
   */
  @Get('portal')
  @UseGuards(AuthGuard)
  async getPortal(@GetUser() user: JwtPayload) {
    const data = await this.paymentsService.getPortalUrl(user.sub);
    return { success: true, data };
  }

  /**
   * POST /payments/webhook
   * Prima webhook događaje od Lemon Squeezy.
   * Nema AuthGuard — dolazi direktno od LS servera.
   * Zahtijeva raw body za HMAC verifikaciju potpisa.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) return { received: false };

    await this.paymentsService.handleWebhook(rawBody, signature);
    return { received: true };
  }
}
