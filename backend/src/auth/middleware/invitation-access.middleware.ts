import { Injectable, type NestMiddleware, ForbiddenException } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import type { InvitationsService } from "../../invitations/services/invitations.service"

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    username: string
    email: string
  }
}

@Injectable()
export class InvitationAccessMiddleware implements NestMiddleware {
  constructor(private invitationsService: InvitationsService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Only apply to invitation-related routes
    if (!req.path.includes("/invitations/")) {
      return next()
    }

    // Skip for public routes (like accepting invitations by code)
    if (req.path.includes("/accept") || req.method === "GET") {
      return next()
    }

    // Check if user is authenticated
    if (!req.user) {
      throw new ForbiddenException("Authentication required")
    }

    // For invitation creation, verify room access
    if (req.method === "POST" && req.body.roomId) {
      try {
        // This will be handled by the service layer
        // Just pass through for now
        return next()
      } catch (error) {
        throw new ForbiddenException("Access denied to create invitations for this room")
      }
    }

    // For invitation management (revoke, etc.), verify ownership
    if (req.params.invitationId && (req.method === "PATCH" || req.method === "DELETE")) {
      try {
        // This will be handled by the service layer
        // Just pass through for now
        return next()
      } catch (error) {
        throw new ForbiddenException("Access denied to manage this invitation")
      }
    }

    next()
  }
}
