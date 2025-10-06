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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_entity_1 = require("./message.entity");
let MessagesService = class MessagesService {
    messageRepository;
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    async create(createMessageDto) {
        const contentHash = await this.hashMessageContent(createMessageDto.content);
        const message = this.messageRepository.create({
            roomId: createMessageDto.roomId,
            contentHash,
            senderId: createMessageDto.senderId,
        });
        return this.messageRepository.save(message);
    }
    async findByRoom(roomId) {
        return this.messageRepository.find({
            where: { roomId },
            order: { createdAt: 'ASC' },
        });
    }
    async hashMessageContent(content) {
        return ('QmFakeIpfsHashFor_' + Buffer.from(content).toString('hex').slice(0, 16));
    }
    async findAllByRoom(getMessagesDto) {
        const { roomId, page = 1, limit = 20 } = getMessagesDto;
        if (page < 1) {
            throw new BadRequestException("Page must be greater than 0");
        }
        if (limit < 1 || limit > 100) {
            throw new BadRequestException("Limit must be between 1 and 100");
        }
        const offset = (page - 1) * limit;
        const queryBuilder = this.messageRepository
            .createQueryBuilder("message")
            .where("message.roomId = :roomId", { roomId })
            .andWhere("message.isDeleted = :isDeleted", { isDeleted: false })
            .orderBy("message.createdAt", "DESC")
            .skip(offset)
            .take(limit);
        const [messages, totalItems] = await queryBuilder.getManyAndCount();
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        const meta = {
            page,
            limit,
            totalItems,
            totalPages,
            hasNextPage,
            hasPreviousPage,
        };
        return {
            data: messages,
            meta,
        };
    }
    async findOne(id) {
        const message = await this.messageRepository.findOne({
            where: { id, isDeleted: false },
        });
        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return message;
    }
    async update(id, updateData) {
        const message = await this.findOne(id);
        Object.assign(message, updateData);
        return await this.messageRepository.save(message);
    }
    async remove(id) {
        const message = await this.findOne(id);
        message.isDeleted = true;
        await this.messageRepository.save(message);
    }
    async getMessageCountByRoom(roomId) {
        return await this.messageRepository.count({
            where: { roomId, isDeleted: false },
        });
    }
    async findRecentMessages(roomId, cursor, limit = 20) {
        const queryBuilder = this.messageRepository
            .createQueryBuilder("message")
            .where("message.roomId = :roomId", { roomId })
            .andWhere("message.isDeleted = :isDeleted", { isDeleted: false })
            .orderBy("message.createdAt", "DESC")
            .limit(limit + 1);
        if (cursor) {
            queryBuilder.andWhere("message.createdAt < :cursor", { cursor });
        }
        const messages = await queryBuilder.getMany();
        let nextCursor;
        if (messages.length > limit) {
            const lastMessage = messages.pop();
            nextCursor = lastMessage?.createdAt.toISOString();
        }
        return {
            messages,
            nextCursor,
        };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MessagesService);
//# sourceMappingURL=messages.service.js.map