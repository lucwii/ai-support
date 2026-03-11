import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtPayload } from './types/jwt-payload.types';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    // Supabase verifikuje token server-side — nema potrebe za manualnim jwt.verify
    const { data: { user }, error } = await this.supabaseService.db.auth.getUser(token);

    if (error || !user) {
      this.logger.warn(`Token verification failed: ${error?.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    (request as any).user = {
      sub: user.id,
      email: user.email ?? '',
      role: user.role ?? 'authenticated',
      iat: 0,
      exp: 0,
    } satisfies JwtPayload;

    return true;
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }
}
