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
exports.SwaggerDocsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_docs_service_1 = require("./swagger-docs.service");
let SwaggerDocsController = class SwaggerDocsController {
    swaggerDocsService;
    constructor(swaggerDocsService) {
        this.swaggerDocsService = swaggerDocsService;
    }
    exportOpenApi() {
        return this.swaggerDocsService.getDocument();
    }
    getTags() {
        return this.swaggerDocsService.getTags();
    }
    updateExamples(examples) {
        return this.swaggerDocsService.updateExamples(examples);
    }
    deleteVersion(version) {
        return this.swaggerDocsService.deleteVersion(version);
    }
    simulateAuth(body) {
        return this.swaggerDocsService.simulateAuth(body.token);
    }
};
exports.SwaggerDocsController = SwaggerDocsController;
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export OpenAPI specification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OpenAPI JSON returned' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwaggerDocsController.prototype, "exportOpenApi", null);
__decorate([
    (0, common_1.Get)('tags'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tag groups' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tags' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SwaggerDocsController.prototype, "getTags", null);
__decorate([
    (0, common_1.Put)('examples'),
    (0, swagger_1.ApiOperation)({ summary: 'Update example payloads' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Examples updated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwaggerDocsController.prototype, "updateExamples", null);
__decorate([
    (0, common_1.Delete)('versions/:version'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete version control' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version deleted' }),
    __param(0, (0, common_1.Param)('version')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SwaggerDocsController.prototype, "deleteVersion", null);
__decorate([
    (0, common_1.Post)('auth/simulate'),
    (0, swagger_1.ApiOperation)({ summary: 'Simulate authentication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Auth simulated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SwaggerDocsController.prototype, "simulateAuth", null);
exports.SwaggerDocsController = SwaggerDocsController = __decorate([
    (0, swagger_1.ApiTags)('Swagger Docs'),
    (0, common_1.Controller)('admin/swagger-docs'),
    __metadata("design:paramtypes", [swagger_docs_service_1.SwaggerDocsService])
], SwaggerDocsController);
//# sourceMappingURL=swagger-docs.controller.js.map