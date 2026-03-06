import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './types/jwt-payload.types'; 

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly jwtSecret: string;

  constructor() {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      throw new Error('SUPABASE_JWT_SECRET is not set in .env');
    }
    this.jwtSecret = secret;
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as JwtPayload;

      (request as any).user = payload;

      return true;
    } catch (error) {
      this.logger.warn(`Invalid token: ${error.message}`);

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;

    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) return null;

    return token;
  }
}