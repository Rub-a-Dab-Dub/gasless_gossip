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
exports.PredictionsController = void 0;
const common_1 = require("@nestjs/common");
const predictions_service_1 = require("./predictions.service");
const create_prediction_dto_1 = require("./dto/create-prediction.dto");
const vote_prediction_dto_1 = require("./dto/vote-prediction.dto");
const resolve_prediction_dto_1 = require("./dto/resolve-prediction.dto");
const auth_guard_1 = require("../auth/auth.guard");
const prediction_entity_1 = require("./entities/prediction.entity");
let PredictionsController = class PredictionsController {
    predictionsService;
    constructor(predictionsService) {
        this.predictionsService = predictionsService;
    }
    async createPrediction(req, createPredictionDto) {
        const userId = req.user.id;
        return this.predictionsService.createPrediction(userId, createPredictionDto);
    }
    async voteOnPrediction(req, votePredictionDto) {
        const userId = req.user.id;
        return this.predictionsService.voteOnPrediction(userId, votePredictionDto);
    }
    async resolvePrediction(req, resolvePredictionDto) {
        const userId = req.user.id;
        return this.predictionsService.resolvePrediction(userId, resolvePredictionDto);
    }
    async getPredictionsByRoom(roomId, status) {
        return this.predictionsService.getPredictionsByRoom(roomId, status);
    }
    async getPredictionById(id) {
        return this.predictionsService.getPredictionById(id);
    }
    async getUserPredictions(req) {
        const userId = req.user.id;
        return this.predictionsService.getUserPredictions(userId);
    }
};
exports.PredictionsController = PredictionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_prediction_dto_1.CreatePredictionDto]),
    __metadata("design:returntype", Promise)
], PredictionsController.prototype, "createPrediction", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, vote_prediction_dto_1.VotePredictionDto]),
    __metadata("design:returntype", Promise)
], PredictionsController.prototype, "voteOnPrediction", null);
__decorate([
    (0, common_1.Post)('resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, resolve_prediction_dto_1.ResolvePredictionDto]),
    __metadata("design:returntype", Promise)
], PredictionsController.prototype, "resolvePrediction", null);
__decorate([
    (0, common_1.Get)('room/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PredictionsController.prototype, "getPredictionsByRoom", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PredictionsController.prototype, "getPredictionById", null);
__decorate([
    (0, common_1.Get)('user/my-predictions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PredictionsController.prototype, "getUserPredictions", null);
exports.PredictionsController = PredictionsController = __decorate([
    (0, common_1.Controller)('predictions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [predictions_service_1.PredictionsService])
], PredictionsController);
//# sourceMappingURL=predictions.controller.js.map