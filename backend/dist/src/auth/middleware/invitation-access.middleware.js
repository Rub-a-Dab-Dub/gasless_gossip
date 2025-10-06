"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationAccessMiddleware = void 0;
const common_1 = require("@nestjs/common");
let InvitationAccessMiddleware = class InvitationAccessMiddleware {
    invitationsService;
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    async use(req, res, next) {
        if (!req.path.includes("/invitations/")) {
            return next();
        }
        if (req.path.includes("/accept") || req.method === "GET") {
            return next();
        }
        if (!req.user) {
            throw new common_1.ForbiddenException("Authentication required");
        }
        if (req.method === "POST" && req.body.roomId) {
            try {
                return next();
            }
            catch (error) {
                throw new common_1.ForbiddenException("Access denied to create invitations for this room");
            }
        }
        if (req.params.invitationId && (req.method === "PATCH" || req.method === "DELETE")) {
            try {
                return next();
            }
            catch (error) {
                throw new common_1.ForbiddenException("Access denied to manage this invitation");
            }
        }
        next();
    }
};
exports.InvitationAccessMiddleware = InvitationAccessMiddleware;
exports.InvitationAccessMiddleware = InvitationAccessMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], InvitationAccessMiddleware);
//# sourceMappingURL=invitation-access.middleware.js.map