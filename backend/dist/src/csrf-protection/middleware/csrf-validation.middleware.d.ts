import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CsrfProtectionService } from '../csrf-protection.service';
export declare class CsrfValidationMiddleware implements NestMiddleware {
    private readonly csrfProtectionService;
    constructor(csrfProtectionService: CsrfProtectionService);
    use(req: Request, res: Response, next: NextFunction): void;
}
