"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    users = new Map();
    async register(dto) {
        const id = Date.now().toString();
        const user = { id, username: dto.username, email: dto.email || null };
        this.users.set(id, { ...user, password: dto.password });
        return { user, accessToken: `mock-token-${id}` };
    }
    async validateUser(username, password) {
        for (const [, u] of this.users) {
            if (u.username === username && u.password === password) {
                const { password: _p, ...user } = u;
                return user;
            }
        }
        return null;
    }
    async login(username, password) {
        const user = await this.validateUser(username, password);
        if (!user)
            return null;
        return { user, accessToken: `mock-token-${user.id}` };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map