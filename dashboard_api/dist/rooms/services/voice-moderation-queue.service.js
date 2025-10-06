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
var VoiceModerationQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceModerationQueueService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let VoiceModerationQueueService = VoiceModerationQueueService_1 = class VoiceModerationQueueService {
    logger = new common_1.Logger(VoiceModerationQueueService_1.name);
    queue = [];
    maxQueueSize = 100;
    processingCounter = 0;
    async addToQueue(item) {
        if (this.queue.length >= this.maxQueueSize) {
            const lowPriorityIndex = this.queue.findIndex(item => item.priority === 'low' && item.status === 'pending');
            if (lowPriorityIndex !== -1) {
                this.queue.splice(lowPriorityIndex, 1);
                this.logger.warn(`Removed low-priority item from full queue`);
            }
            else {
                throw new Error('Moderation queue is full');
            }
        }
        const moderationItem = {
            ...item,
            id: this.generateId(),
            status: 'pending',
            submittedAt: new Date(),
            autoModerationScore: await this.calculateAutoModerationScore(item.voiceNoteUrl, item.content)
        };
        const insertIndex = this.findInsertPosition(moderationItem.priority);
        this.queue.splice(insertIndex, 0, moderationItem);
        this.logger.log(`Added voice note to moderation queue: ${moderationItem.id} (priority: ${item.priority})`);
        if (moderationItem.autoModerationScore !== undefined) {
            await this.processAutoModeration(moderationItem);
        }
        return insertIndex + 1;
    }
    getQueueStatus() {
        const pendingItems = this.queue.filter(item => item.status === 'pending').length;
        const processingItems = this.queue.filter(item => item.status === 'processing').length;
        return {
            totalItems: this.queue.length,
            pendingItems,
            processingItems,
            queueCapacity: this.maxQueueSize,
            averageProcessingTime: this.calculateAverageProcessingTime(),
            items: [...this.queue]
        };
    }
    async processItem(itemId, moderatorId, decision, reason) {
        const itemIndex = this.queue.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            throw new Error(`Moderation item not found: ${itemId}`);
        }
        const item = this.queue[itemIndex];
        item.status = decision;
        item.processedAt = new Date();
        item.moderatorId = moderatorId;
        item.reason = reason;
        this.logger.log(`Processed moderation item: ${itemId} (decision: ${decision})`);
        setTimeout(() => {
            const currentIndex = this.queue.findIndex(queueItem => queueItem.id === itemId);
            if (currentIndex !== -1) {
                this.queue.splice(currentIndex, 1);
            }
        }, 30000);
    }
    getItemsByRoom(roomId) {
        return this.queue.filter(item => item.roomId === roomId);
    }
    async processAutoModerationQueue() {
        const pendingItems = this.queue.filter(item => item.status === 'pending');
        if (pendingItems.length === 0) {
            return;
        }
        this.logger.log(`Processing auto-moderation for ${pendingItems.length} items`);
        for (const item of pendingItems) {
            try {
                await this.processAutoModeration(item);
                this.processingCounter++;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            catch (error) {
                this.logger.error(`Failed to auto-process item ${item.id}:`, error);
            }
        }
        this.logger.log(`Auto-processed ${this.processingCounter} items`);
    }
    async processAutoModeration(item) {
        if (item.autoModerationScore === undefined) {
            return;
        }
        if (item.autoModerationScore > 90) {
            item.status = 'approved';
            item.processedAt = new Date();
            item.moderatorId = 'auto-moderation';
            item.reason = 'Auto-approved: High confidence score';
            setTimeout(() => {
                const index = this.queue.findIndex(queueItem => queueItem.id === item.id);
                if (index !== -1)
                    this.queue.splice(index, 1);
            }, 10000);
        }
        else if (item.autoModerationScore < 10) {
            item.status = 'rejected';
            item.processedAt = new Date();
            item.moderatorId = 'auto-moderation';
            item.reason = 'Auto-rejected: Low confidence score';
            setTimeout(() => {
                const index = this.queue.findIndex(queueItem => queueItem.id === item.id);
                if (index !== -1)
                    this.queue.splice(index, 1);
            }, 10000);
        }
    }
    async calculateAutoModerationScore(voiceNoteUrl, content) {
        let score = 50;
        if (content) {
            const harmfulWords = ['spam', 'scam', 'inappropriate', 'offensive'];
            const positiveWords = ['thank', 'helpful', 'great', 'awesome'];
            const lowerContent = content.toLowerCase();
            harmfulWords.forEach(word => {
                if (lowerContent.includes(word))
                    score -= 20;
            });
            positiveWords.forEach(word => {
                if (lowerContent.includes(word))
                    score += 15;
            });
        }
        score += Math.random() * 20 - 10;
        return Math.max(0, Math.min(100, score));
    }
    findInsertPosition(priority) {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const itemPriority = priorityValues[priority];
        for (let i = 0; i < this.queue.length; i++) {
            const queueItemPriority = priorityValues[this.queue[i].priority];
            if (itemPriority > queueItemPriority) {
                return i;
            }
        }
        return this.queue.length;
    }
    generateId() {
        return `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    calculateAverageProcessingTime() {
        const processedItems = this.queue.filter(item => item.processedAt && item.submittedAt);
        if (processedItems.length === 0)
            return 0;
        const totalTime = processedItems.reduce((sum, item) => {
            const processingTime = item.processedAt.getTime() - item.submittedAt.getTime();
            return sum + processingTime;
        }, 0);
        return Math.round(totalTime / processedItems.length / 1000);
    }
};
exports.VoiceModerationQueueService = VoiceModerationQueueService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceModerationQueueService.prototype, "processAutoModerationQueue", null);
exports.VoiceModerationQueueService = VoiceModerationQueueService = VoiceModerationQueueService_1 = __decorate([
    (0, common_1.Injectable)()
], VoiceModerationQueueService);
//# sourceMappingURL=voice-moderation-queue.service.js.map