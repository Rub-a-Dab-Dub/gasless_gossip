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
var ReactionsTrackerGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionsTrackerGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const reactions_tracker_service_1 = require("./reactions-tracker.service");
const reaction_metrics_filter_dto_1 = require("./dto/reaction-metrics-filter.dto");
let ReactionsTrackerGateway = ReactionsTrackerGateway_1 = class ReactionsTrackerGateway {
    reactionsTrackerService;
    server;
    logger = new common_1.Logger(ReactionsTrackerGateway_1.name);
    constructor(reactionsTrackerService) {
        this.reactionsTrackerService = reactionsTrackerService;
    }
    async handleAddReaction(reactionUpdate, client) {
        try {
            const updatedTrack = await this.reactionsTrackerService.aggregateReaction(reactionUpdate);
            this.server.emit('reactionUpdated', {
                messageId: updatedTrack.messageId,
                totalCount: updatedTrack.totalCount,
                likeCount: updatedTrack.likeCount,
                loveCount: updatedTrack.loveCount,
                laughCount: updatedTrack.laughCount,
                angryCount: updatedTrack.angryCount,
                sadCount: updatedTrack.sadCount,
                updatedAt: updatedTrack.updatedAt,
            });
            this.logger.log(`Reaction added for message ${reactionUpdate.messageId}`);
        }
        catch (error) {
            this.logger.error('Error handling add reaction', error);
            client.emit('error', { message: 'Failed to add reaction' });
        }
    }
    async handleRemoveReaction(reactionUpdate, client) {
        try {
            const updatedTrack = await this.reactionsTrackerService.removeReaction(reactionUpdate);
            this.server.emit('reactionUpdated', {
                messageId: updatedTrack.messageId,
                totalCount: updatedTrack.totalCount,
                likeCount: updatedTrack.likeCount,
                loveCount: updatedTrack.loveCount,
                laughCount: updatedTrack.laughCount,
                angryCount: updatedTrack.angryCount,
                sadCount: updatedTrack.sadCount,
                updatedAt: updatedTrack.updatedAt,
            });
            this.logger.log(`Reaction removed for message ${reactionUpdate.messageId}`);
        }
        catch (error) {
            this.logger.error('Error handling remove reaction', error);
            client.emit('error', { message: 'Failed to remove reaction' });
        }
    }
};
exports.ReactionsTrackerGateway = ReactionsTrackerGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ReactionsTrackerGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('addReaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reaction_metrics_filter_dto_1.ReactionUpdateDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ReactionsTrackerGateway.prototype, "handleAddReaction", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeReaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reaction_metrics_filter_dto_1.ReactionUpdateDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ReactionsTrackerGateway.prototype, "handleRemoveReaction", null);
exports.ReactionsTrackerGateway = ReactionsTrackerGateway = ReactionsTrackerGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'reactions',
    }),
    __metadata("design:paramtypes", [reactions_tracker_service_1.ReactionsTrackerService])
], ReactionsTrackerGateway);
//# sourceMappingURL=reactions-tracker.gateway.js.map