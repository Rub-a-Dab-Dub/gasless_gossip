import { Injectable } from '@nestjs/common';
import { randomBytes, createHmac } from 'crypto';
import { CsrfToken, CsrfValidationResult } from './interfaces/csrf-token.interface';

@Injectable()
export class CsrfProtectionService {
  private readonly secret = process.env.CSRF_SECRET || 'default-csrf-secret';
  private readonly tokenExpiry = 3600000; // 1 hour in milliseconds

  generateToken(): CsrfToken {
    const timestamp = Date.now().toString();
    const randomValue = randomBytes(32).toString('hex');
    const payload = `${timestamp}:${randomValue}`;
    
    const signature = createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');
    
    const token = `${payload}:${signature}`;
    const expiresAt = new Date(Date.now() + this.tokenExpiry);
    
    return { token, expiresAt };
  }

  validateToken(token: string): CsrfValidationResult {
    if (!token) {
      return { isValid: false, message: 'CSRF token is required' };
    }

    try {
      const parts = token.split(':');
      if (parts.length !== 3) {
        return { isValid: false, message: 'Invalid CSRF token format' };
      }

      const [timestamp, randomValue, signature] = parts;
      const payload = `${timestamp}:${randomValue}`;
      
      // Verify signature
      const expectedSignature = createHmac('sha256', this.secret)
        .update(payload)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return { isValid: false, message: 'Invalid CSRF token signature' };
      }

      // Check expiration
      const tokenTime = parseInt(timestamp, 10);
      if (Date.now() - tokenTime > this.tokenExpiry) {
        return { isValid: false, message: 'CSRF token has expired' };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, message: 'CSRF token validation failed' };
    }
  }
}