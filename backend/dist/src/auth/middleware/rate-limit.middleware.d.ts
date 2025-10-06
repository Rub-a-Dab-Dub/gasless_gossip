import { type NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
export declare class RateLimitMiddleware implements NestMiddleware {
    private store;
    private readonly windowMs;
    private readonly maxRequests;
    use(req: Request, res: Response, next: NextFunction): void;
    private getKey;
    private cleanup;
}
