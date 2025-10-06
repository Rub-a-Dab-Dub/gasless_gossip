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
exports.SampleDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let SampleDataController = class SampleDataController {
    sampleDataService;
    constructor(sampleDataService) {
        this.sampleDataService = sampleDataService;
    }
    async generateSampleData() {
        await this.sampleDataService.runFullSampleDataGeneration();
        return {
            message: 'Sample data generated successfully. Check logs for detailed results.',
            timestamp: new Date().toISOString(),
        };
    }
    async resetSampleData() {
        await this.sampleDataService.resetSampleData();
        return {
            message: 'Sample data reset successfully',
            timestamp: new Date().toISOString(),
        };
    }
};
exports.SampleDataController = SampleDataController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate sample users and XP data for testing',
        description: 'Creates sample users with various XP levels to test the level system functionality',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sample data generated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                timestamp: { type: 'string' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SampleDataController.prototype, "generateSampleData", null);
__decorate([
    (0, common_1.Delete)('reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset all sample data',
        description: 'Clears all sample level data from the system',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sample data reset successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                timestamp: { type: 'string' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SampleDataController.prototype, "resetSampleData", null);
exports.SampleDataController = SampleDataController = __decorate([
    (0, swagger_1.ApiTags)('sample-data'),
    (0, common_1.Controller)('sample-data'),
    __metadata("design:paramtypes", [Function])
], SampleDataController);
//# sourceMappingURL=sample-data.controller.js.map