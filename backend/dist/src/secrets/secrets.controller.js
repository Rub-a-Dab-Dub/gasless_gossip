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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsController = void 0;
const common_1 = require("@nestjs/common");
const secrets_service_1 = require("./secrets.service");
const create_secret_dto_1 = require("./dto/create-secret.dto");
let SecretsController = class SecretsController {
    secretsService;
    constructor(secretsService) {
        this.secretsService = secretsService;
    }
    async createSecret(createSecretDto) {
        return this.secretsService.createSecret(createSecretDto);
    }
    async getTopSecrets(roomId, limit) {
        return this.secretsService.getTopSecrets(roomId, limit);
    }
    async reactToSecret(id) {
        return this.secretsService.incrementReaction(id);
    }
};
exports.SecretsController = SecretsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_secret_dto_1.CreateSecretDto]),
    __metadata("design:returntype", Promise)
], SecretsController.prototype, "createSecret", null);
__decorate([
    (0, common_1.Get)('top'),
    __param(0, (0, common_1.Query)('roomId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SecretsController.prototype, "getTopSecrets", null);
__decorate([
    (0, common_1.Post)(':id/react'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SecretsController.prototype, "reactToSecret", null);
exports.SecretsController = SecretsController = __decorate([
    (0, common_1.Controller)('secrets'),
    __metadata("design:paramtypes", [secrets_service_1.SecretsService])
], SecretsController);
//# sourceMappingURL=secrets.controller.js.map