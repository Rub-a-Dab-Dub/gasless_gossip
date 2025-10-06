import { type NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import type { InvitationsService } from "../../invitations/services/invitations.service";
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
    };
}
export declare class InvitationAccessMiddleware implements NestMiddleware {
    private invitationsService;
    constructor(invitationsService: InvitationsService);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
export {};
