import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY') ?? '';
    this.resend = new Resend(apiKey);
    this.fromEmail =
      this.configService.get<string>('FROM_EMAIL') ?? 'SupportAI <onboarding@resend.dev>';
  }

  async sendTicketResolvedEmail(params: {
    to: string;
    ticketContent: string;
    response: string;
    organizationName: string;
  }): Promise<void> {
    const { to, ticketContent, response, organizationName } = params;

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: `Your support request has been answered — ${organizationName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2 style="color: #6366f1;">Your question has been answered</h2>
            <p style="color: #64748b; font-size: 14px;">
              You submitted a support request to <strong>${organizationName}</strong>. Here is the response:
            </p>

            <div style="background: #f8fafc; border-left: 3px solid #94a3b8; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="font-size: 13px; color: #64748b; margin: 0 0 4px 0;">Your question:</p>
              <p style="font-size: 14px; color: #334155; margin: 0;">${ticketContent}</p>
            </div>

            <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
              <p style="font-size: 13px; color: #64748b; margin: 0 0 4px 0;">Answer:</p>
              <p style="font-size: 14px; color: #166534; margin: 0; white-space: pre-wrap;">${response}</p>
            </div>

            <p style="font-size: 13px; color: #94a3b8; margin-top: 32px;">
              Powered by SupportAI
            </p>
          </div>
        `,
      });

      this.logger.log(`Resolved email sent to ${to}`);
    } catch (err) {
      // Email failure should NOT block the ticket resolution
      this.logger.error(`Failed to send resolved email to ${to}: ${(err as Error).message}`);
    }
  }
}
