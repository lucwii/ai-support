import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly apiKey: string;
  private readonly storeId: string;
  private readonly webhookSecret: string;
  private readonly baseUrl = 'https://api.lemonsqueezy.com/v1';

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {
    this.apiKey = this.configService.getOrThrow<string>('LEMON_SQUEEZY_API_KEY');
    this.storeId = this.configService.getOrThrow<string>('LEMON_SQUEEZY_STORE_ID');
    this.webhookSecret = this.configService.getOrThrow<string>('LEMON_SQUEEZY_WEBHOOK_SECRET');
  }

  // ── Checkout ──────────────────────────────────────────────────────────────

  async createCheckout(userId: string, variantId: string): Promise<{ checkout_url: string }> {
    const org = await this.getOrgByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');

    const { data: authUser } = await this.supabaseService.db.auth.admin.getUserById(userId);
    const email = authUser?.user?.email ?? undefined;
    const name = authUser?.user?.user_metadata?.full_name
      ?? authUser?.user?.user_metadata?.name
      ?? undefined;

    const body = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email,
            name,
            custom: {
              organization_id: org.id,
              user_id: userId,
            },
          },
          product_options: {
            redirect_url: `${this.configService.get('FRONTEND_URL')}/dashboard/settings?tab=billing&success=1`,
          },
        },
        relationships: {
          store: {
            data: { type: 'stores', id: String(this.storeId) },
          },
          variant: {
            data: { type: 'variants', id: String(variantId) },
          },
        },
      },
    };

    const res = await this.lsRequest('POST', '/checkouts', body);
    const checkoutUrl = res?.data?.attributes?.url;

    if (!checkoutUrl) {
      this.logger.error('Lemon Squeezy did not return a checkout URL', res);
      throw new BadRequestException('Failed to create checkout');
    }

    this.logger.log(`Checkout created for org ${org.id}`);
    return { checkout_url: checkoutUrl };
  }

  // ── Customer portal ───────────────────────────────────────────────────────

  async getPortalUrl(userId: string): Promise<{ portal_url: string }> {
    const org = await this.getOrgByUserId(userId);
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.lemon_squeezy_subscription_id) {
      throw new BadRequestException('No active subscription found');
    }

    const res = await this.lsRequest(
      'GET',
      `/subscriptions/${org.lemon_squeezy_subscription_id}`,
    );

    const portalUrl = res?.data?.attributes?.urls?.customer_portal;
    if (!portalUrl) throw new BadRequestException('Could not retrieve portal URL');

    return { portal_url: portalUrl };
  }

  // ── Webhook ───────────────────────────────────────────────────────────────

  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    this.verifySignature(rawBody, signature);

    let payload: any;
    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      throw new BadRequestException('Invalid webhook payload');
    }

    const eventName: string = payload?.meta?.event_name;
    const orgId: string | undefined = payload?.meta?.custom_data?.organization_id;

    this.logger.log(`Webhook received: ${eventName} | org: ${orgId ?? 'unknown'}`);

    if (!orgId) {
      this.logger.warn(`Webhook ${eventName} missing organization_id in custom_data — skipping`);
      return;
    }

    const attrs = payload?.data?.attributes;
    const subscriptionId = String(payload?.data?.id);
    const customerId = String(attrs?.customer_id ?? '');

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_resumed':
        await this.updateSubscription(orgId, {
          lemon_squeezy_subscription_id: subscriptionId,
          lemon_squeezy_customer_id: customerId,
          subscription_status: 'active',
          subscription_plan: this.resolvePlan(attrs?.variant_id),
          subscription_renews_at: attrs?.renews_at ?? null,
          subscription_ends_at: null,
        });
        break;

      case 'subscription_updated':
        await this.updateSubscription(orgId, {
          lemon_squeezy_subscription_id: subscriptionId,
          lemon_squeezy_customer_id: customerId,
          subscription_status: this.mapStatus(attrs?.status),
          subscription_plan: this.resolvePlan(attrs?.variant_id),
          subscription_renews_at: attrs?.renews_at ?? null,
          subscription_ends_at: attrs?.ends_at ?? null,
        });
        break;

      case 'subscription_cancelled':
        await this.updateSubscription(orgId, {
          subscription_status: 'cancelled',
          subscription_ends_at: attrs?.ends_at ?? null,
          subscription_renews_at: null,
        });
        break;

      case 'subscription_expired':
        await this.updateSubscription(orgId, {
          subscription_status: 'expired',
          subscription_renews_at: null,
        });
        break;

      default:
        this.logger.debug(`Unhandled webhook event: ${eventName}`);
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private verifySignature(rawBody: Buffer, signature: string): void {
    if (!signature) throw new UnauthorizedException('Missing X-Signature header');

    const hmac = createHmac('sha256', this.webhookSecret);
    hmac.update(rawBody);
    const digest = hmac.digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const digestBuffer = Buffer.from(digest, 'hex');

    if (
      sigBuffer.length !== digestBuffer.length ||
      !timingSafeEqual(sigBuffer, digestBuffer)
    ) {
      this.logger.warn('Webhook signature mismatch');
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }

  private async updateSubscription(orgId: string, data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabaseService.db
      .from('organizations')
      .update(data)
      .eq('id', orgId);

    if (error) {
      this.logger.error(`Failed to update subscription for org ${orgId}: ${error.message}`);
    } else {
      this.logger.log(`Subscription updated for org ${orgId}`);
    }
  }

  private async getOrgByUserId(userId: string) {
    const { data } = await this.supabaseService.db
      .from('organization_members')
      .select('organizations (*)')
      .eq('user_id', userId)
      .single();

    return (data?.organizations as any) ?? null;
  }

  private async lsRequest(method: 'GET' | 'POST', path: string, body?: unknown) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Lemon Squeezy API error ${res.status}: ${text}`);
      throw new BadRequestException(`Lemon Squeezy error: ${res.status}`);
    }

    return res.json();
  }

  private mapStatus(lsStatus: string): string {
    const map: Record<string, string> = {
      active: 'active',
      past_due: 'past_due',
      unpaid: 'past_due',
      paused: 'paused',
      cancelled: 'cancelled',
      expired: 'expired',
    };
    return map[lsStatus] ?? lsStatus;
  }

  private resolvePlan(variantId: number | string): string {
    const starter = this.configService.get<string>('LEMON_SQUEEZY_VARIANT_STARTER');
    const pro = this.configService.get<string>('LEMON_SQUEEZY_VARIANT_PRO');
    const id = String(variantId);
    if (id === starter) return 'starter';
    if (id === pro) return 'pro';
    return 'unknown';
  }
}
