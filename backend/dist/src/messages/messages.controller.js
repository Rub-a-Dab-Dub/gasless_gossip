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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const message_entity_1 = require("./message.entity");
const auth_guard_1 = require("../auth/auth.guard");
let MessagesController = class MessagesController {
    messagesService;
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    async create(createMessageDto, req) {
        if (!this.userHasRoomAccess(req.user, createMessageDto.roomId)) {
            throw new common_1.ForbiddenException('No access to this room');
        }
        return this.messagesService.create(createMessageDto);
    }
    async findByRoom(roomId, req) {
        if (!this.userHasRoomAccess(req.user, roomId)) {
            throw new common_1.ForbiddenException('No access to this room');
        }
        return this.messagesService.findByRoom(roomId);
    }
    userHasRoomAccess(user, roomId) {
        return true;
    }
    async findAllByRoom(roomId, query) {
        const getMessagesDto = {
            ...query,
            roomId,
        };
        return await this.messagesService.findAllByRoom(getMessagesDto);
    }
    async findOne(id) {
        return await this.messagesService.findOne(id);
    }
    async update(id, updateMessageDto) {
        return await this.messagesService.update(id, updateMessageDto);
    }
    async remove(id) {
        return await this.messagesService.remove(id);
    }
    async getMessageCount(roomId) {
        const count = await this.messagesService.getMessageCountByRoom(roomId);
        return { count };
    }
    async getRecentMessages(roomId, cursor, limit) {
        return await this.messagesService.findRecentMessages(roomId, cursor, limit ? Math.min(limit, 100) : 20);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findByRoom", null);
__decorate([
    (0, common_1.Get)(":roomId"),
    ApiOperation({
        summary: "Get paginated messages for a specific room",
        description: "Retrieves messages from a secret room with pagination support for improved performance",
    }),
    ApiParam({
        name: "roomId",
        description: "UUID of the room to fetch messages from",
        example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    ApiQuery({
        name: "page",
        required: false,
        description: "Page number (1-based)",
        example: 1,
    }),
    ApiQuery({
        name: "limit",
        required: false,
        description: "Number of messages per page (max 100)",
        example: 20,
    }),
    ApiResponse({
        status: HttpStatus.OK,
        description: "Messages retrieved successfully with pagination metadata",
        type: PaginatedMessagesDto,
    }),
    ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Invalid pagination parameters",
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Room not found",
    }),
    __param(0, (0, common_1.Param)('roomId', ParseUUIDPipe)),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findAllByRoom", null);
__decorate([
    (0, common_1.Get)('single/:id'),
    ApiOperation({ summary: 'Get a specific message by ID' }),
    ApiParam({
        name: 'id',
        description: 'UUID of the message',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Message found',
        type: message_entity_1.Message,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Message not found',
    }),
    __param(0, (0, common_1.Param)('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "findOne", null);
__decorate([
    Patch(":id"),
    ApiOperation({ summary: "Update a message" }),
    ApiParam({
        name: "id",
        description: "UUID of the message to update",
        example: "123e4567-e89b-12d3-a456-426614174001",
    }),
    ApiResponse({
        status: HttpStatus.OK,
        description: "Message updated successfully",
        type: message_entity_1.Message,
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Message not found",
    }),
    __param(0, (0, common_1.Param)('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Soft delete a message' }),
    ApiParam({
        name: 'id',
        description: 'UUID of the message to delete',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Message deleted successfully',
    }),
    ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Message not found',
    }),
    __param(0, (0, common_1.Param)('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('room/:roomId/count'),
    ApiOperation({ summary: 'Get total message count for a room' }),
    ApiParam({
        name: 'roomId',
        description: 'UUID of the room',
        example: '123e4567-e89b-12d3-a456-446655440000',
    }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Message count retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                count: { type: 'number', example: 150 },
            },
        },
    }),
    __param(0, (0, common_1.Param)('roomId', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getMessageCount", null);
__decorate([
    (0, common_1.Get)("room/:roomId/recent"),
    ApiOperation({
        summary: "Get recent messages with cursor-based pagination",
        description: "Alternative pagination method using cursor for real-time applications",
    }),
    ApiParam({
        name: "roomId",
        description: "UUID of the room",
        example: "123e4567-e89b-12d3-a456-446655440000",
    }),
    ApiQuery({
        name: "cursor",
        required: false,
        description: "Cursor for pagination (ISO date string)",
        example: "2024-01-15T10:30:00.000Z",
    }),
    ApiQuery({
        name: "limit",
        required: false,
        description: "Number of messages to fetch (max 100)",
        example: 20,
    }),
    ApiResponse({
        status: HttpStatus.OK,
        description: "Recent messages retrieved successfully",
        schema: {
            type: "object",
            properties: {
                messages: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Message" },
                },
                nextCursor: { type: "string", nullable: true },
            },
        },
    }),
    __param(0, (0, common_1.Param)('roomId', ParseUUIDPipe)),
    __param(1, Query('cursor')),
    __param(2, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], MessagesController.prototype, "getRecentMessages", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map