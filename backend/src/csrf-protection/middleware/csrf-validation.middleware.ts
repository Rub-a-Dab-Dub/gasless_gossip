import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfProtectionService } from '../csrf-protection.service';

@Injectable()
export class CsrfValidationMiddleware implements NestMiddleware {
  constructor(private readonly csrfProtectionService: CsrfProtectionService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Only validate CSRF for POST, PUT, PATCH, DELETE requests
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    // Get CSRF token from header or body
    const csrfToken = req.headers['x-csrf-token'] as string || 
                      req.body._csrf || 
                      req.body.csrfToken;

    const validationResult = this.csrfProtectionService.validateToken(csrfToken);
    
    if (!validationResult.isValid) {
      throw new ForbiddenException(validationResult.message || 'CSRF validation failed');
    }

    next();
  }
}