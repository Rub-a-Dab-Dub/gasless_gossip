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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsTrackerModule = exports.ReactionsTrackerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reactions_tracker_service_1 = require("./reactions-tracker.service");
const reaction_metrics_filter_dto_1 = require("./dto/reaction-metrics-filter.dto");
const reaction_update_dto_1 = require("./dto/reaction-update.dto");
const reaction_track_response_dto_1 = require("./dto/reaction-track-response.dto");
let ReactionsTrackerController = class ReactionsTrackerController {
    reactionsTrackerService;
    constructor(reactionsTrackerService) {
        this.reactionsTrackerService = reactionsTrackerService;
    }
    async getReactionsByMessageId(messageId) {
        const reactions = await this.reactionsTrackerService.getReactionsByMessageId(messageId);
        if (!reactions) {
            throw new common_1.NotFoundException(`No reactions found for message ${messageId}`);
        }
        return reactions;
    }
    async getMostReactedSecrets(filters) {
        return await this.reactionsTrackerService.getMostReactedSecrets(filters);
    }
    async addReaction(reactionUpdate) {
        return await this.reactionsTrackerService.aggregateReaction(reactionUpdate);
    }
    async removeReaction(reactionUpdate) {
        return await this.reactionsTrackerService.removeReaction(reactionUpdate);
    }
};
exports.ReactionsTrackerController = ReactionsTrackerController;
__decorate([
    (0, common_1.Get)(':messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get reaction counts for a specific message' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'UUID of the message' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reaction counts retrieved successfully',
        type: reaction_track_response_dto_1.ReactionTrackResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No reactions found for this message',
    }),
    __param(0, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], reactions_tracker_controller_1.ReactionsTrackerController.prototype, "getReactionsByMessageId", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get most reacted secrets with filtering options' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Most reacted secrets retrieved successfully',
        type: reaction_track_response_dto_1.MostReactedSecretsResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reaction_metrics_filter_dto_1.ReactionMetricsFilterDto]),
    __metadata("design:returntype", Promise)
], reactions_tracker_controller_1.ReactionsTrackerController.prototype, "getMostReactedSecrets", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a reaction to a message' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reaction added successfully',
        type: reaction_track_response_dto_1.ReactionTrackResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof reaction_update_dto_1.ReactionUpdateDto !== "undefined" && reaction_update_dto_1.ReactionUpdateDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], reactions_tracker_controller_1.ReactionsTrackerController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Delete)('remove'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a reaction from a message' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Reaction removed successfully',
        type: reaction_track_response_dto_1.ReactionTrackResponseDto,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof reaction_update_dto_1.ReactionUpdateDto !== "undefined" && reaction_update_dto_1.ReactionUpdateDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], reactions_tracker_controller_1.ReactionsTrackerController.prototype, "removeReaction", null);
exports.ReactionsTrackerController = reactions_tracker_controller_1.ReactionsTrackerController = __decorate([
    (0, swagger_1.ApiTags)('reactions-tracker'),
    (0, common_1.Controller)('reactions-tracker'),
    __metadata("design:paramtypes", [reactions_tracker_service_1.ReactionsTrackerService])
], reactions_tracker_controller_1.ReactionsTrackerController);
const common_2 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reactions_tracker_controller_1 = require("./reactions-tracker.controller");
Object.defineProperty(exports, "ReactionsTrackerController", { enumerable: true, get: function () { return reactions_tracker_controller_1.ReactionsTrackerController; } });
const reactions_tracker_gateway_1 = require("./reactions-tracker.gateway");
const reactions_tracker_entity_1 = require("./reactions-tracker.entity");
let ReactionsTrackerModule = class ReactionsTrackerModule {
};
exports.ReactionsTrackerModule = ReactionsTrackerModule;
exports.ReactionsTrackerModule = ReactionsTrackerModule = __decorate([
    (0, common_2.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([reactions_tracker_entity_1.ReactionTrack])],
        controllers: [reactions_tracker_controller_1.ReactionsTrackerController],
        providers: [reactions_tracker_service_1.ReactionsTrackerService, reactions_tracker_gateway_1.ReactionsTrackerGateway],
        exports: [reactions_tracker_service_1.ReactionsTrackerService],
    })
], ReactionsTrackerModule);
//# sourceMappingURL=reactions-tracker.controller.js.map