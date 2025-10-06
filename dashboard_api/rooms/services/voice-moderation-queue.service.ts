import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface VoiceModerationItem {
  id: string;
  roomId: string;
  userId: string;
  voiceNoteUrl: string;
  content?: string; // Transcribed content if available
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
  moderatorId?: string;
  reason?: string;
  autoModerationScore?: number;
}

@Injectable()
export class VoiceModerationQueueService {
  private readonly logger = new Logger(VoiceModerationQueueService.name);
  private readonly queue: VoiceModerationItem[] = [];
  private readonly maxQueueSize = 100;
  private processingCounter = 0;

  /**
   * Add a voice note to the moderation queue
   * @param item - Voice moderation item to add
   * @returns Promise resolving to the queue position
   */
  async addToQueue(item: Omit<VoiceModerationItem, 'id' | 'submittedAt' | 'status'>): Promise<number> {
    if (this.queue.length >= this.maxQueueSize) {
      // Remove oldest low-priority items if queue is full
      const lowPriorityIndex = this.queue.findIndex(item => item.priority === 'low' && item.status === 'pending');
      if (lowPriorityIndex !== -1) {
        this.queue.splice(lowPriorityIndex, 1);
        this.logger.warn(`Removed low-priority item from full queue`);
      } else {
        throw new Error('Moderation queue is full');
      }
    }

    const moderationItem: VoiceModerationItem = {
      ...item,
      id: this.generateId(),
      status: 'pending',
      submittedAt: new Date(),
      autoModerationScore: await this.calculateAutoModerationScore(item.voiceNoteUrl, item.content)
    };

    // Insert based on priority
    const insertIndex = this.findInsertPosition(moderationItem.priority);
    this.queue.splice(insertIndex, 0, moderationItem);

    this.logger.log(`Added voice note to moderation queue: ${moderationItem.id} (priority: ${item.priority})`);
    
    // Auto-process if score is very high or very low
    if (moderationItem.autoModerationScore !== undefined) {
      await this.processAutoModeration(moderationItem);
    }

    return insertIndex + 1; // Return 1-based position
  }

  /**
   * Get the current queue status
   * @returns Queue statistics and items
   */
  getQueueStatus(): {
    totalItems: number;
    pendingItems: number;
    processingItems: number;
    queueCapacity: number;
    averageProcessingTime: number;
    items: VoiceModerationItem[];
  } {
    const pendingItems = this.queue.filter(item => item.status === 'pending').length;
    const processingItems = this.queue.filter(item => item.status === 'processing').length;
    
    return {
      totalItems: this.queue.length,
      pendingItems,
      processingItems,
      queueCapacity: this.maxQueueSize,
      averageProcessingTime: this.calculateAverageProcessingTime(),
      items: [...this.queue] // Return copy to prevent external modifications
    };
  }

  /**
   * Process a specific item in the queue
   * @param itemId - ID of the item to process
   * @param moderatorId - ID of the moderator processing the item
   * @param decision - Moderation decision
   * @param reason - Optional reason for the decision
   */
  async processItem(
    itemId: string, 
    moderatorId: string, 
    decision: 'approved' | 'rejected', 
    reason?: string
  ): Promise<void> {
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

    // Remove processed items after a delay to allow status checking
    setTimeout(() => {
      const currentIndex = this.queue.findIndex(queueItem => queueItem.id === itemId);
      if (currentIndex !== -1) {
        this.queue.splice(currentIndex, 1);
      }
    }, 30000); // Keep processed items for 30 seconds
  }

  /**
   * Get items by room for room-specific moderation
   * @param roomId - Room ID to filter by
   * @returns Array of moderation items for the room
   */
  getItemsByRoom(roomId: string): VoiceModerationItem[] {
    return this.queue.filter(item => item.roomId === roomId);
  }

  /**
   * Auto-process moderation queue every 5 minutes
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async processAutoModerationQueue(): Promise<void> {
    const pendingItems = this.queue.filter(item => item.status === 'pending');
    
    if (pendingItems.length === 0) {
      return;
    }

    this.logger.log(`Processing auto-moderation for ${pendingItems.length} items`);

    for (const item of pendingItems) {
      try {
        await this.processAutoModeration(item);
        this.processingCounter++;
        
        // Add small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.logger.error(`Failed to auto-process item ${item.id}:`, error);
      }
    }

    this.logger.log(`Auto-processed ${this.processingCounter} items`);
  }

  private async processAutoModeration(item: VoiceModerationItem): Promise<void> {
    if (item.autoModerationScore === undefined) {
      return;
    }

    // Auto-approve items with very high scores (>90)
    if (item.autoModerationScore > 90) {
      item.status = 'approved';
      item.processedAt = new Date();
      item.moderatorId = 'auto-moderation';
      item.reason = 'Auto-approved: High confidence score';
      
      setTimeout(() => {
        const index = this.queue.findIndex(queueItem => queueItem.id === item.id);
        if (index !== -1) this.queue.splice(index, 1);
      }, 10000);
    }
    // Auto-reject items with very low scores (<10)
    else if (item.autoModerationScore < 10) {
      item.status = 'rejected';
      item.processedAt = new Date();
      item.moderatorId = 'auto-moderation';
      item.reason = 'Auto-rejected: Low confidence score';
      
      setTimeout(() => {
        const index = this.queue.findIndex(queueItem => queueItem.id === item.id);
        if (index !== -1) this.queue.splice(index, 1);
      }, 10000);
    }
  }

  private async calculateAutoModerationScore(voiceNoteUrl: string, content?: string): Promise<number> {
    // Simplified auto-moderation scoring
    // In a real implementation, this would integrate with AI/ML services
    let score = 50; // Default neutral score

    if (content) {
      // Simple content-based scoring
      const harmfulWords = ['spam', 'scam', 'inappropriate', 'offensive'];
      const positiveWords = ['thank', 'helpful', 'great', 'awesome'];
      
      const lowerContent = content.toLowerCase();
      
      // Decrease score for harmful words
      harmfulWords.forEach(word => {
        if (lowerContent.includes(word)) score -= 20;
      });
      
      // Increase score for positive words
      positiveWords.forEach(word => {
        if (lowerContent.includes(word)) score += 15;
      });
    }

    // Add some randomness to simulate ML uncertainty
    score += Math.random() * 20 - 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private findInsertPosition(priority: 'low' | 'medium' | 'high'): number {
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

  private generateId(): string {
    return `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateAverageProcessingTime(): number {
    const processedItems = this.queue.filter(item => 
      item.processedAt && item.submittedAt
    );

    if (processedItems.length === 0) return 0;

    const totalTime = processedItems.reduce((sum, item) => {
      const processingTime = item.processedAt!.getTime() - item.submittedAt.getTime();
      return sum + processingTime;
    }, 0);

    return Math.round(totalTime / processedItems.length / 1000); // Return in seconds
  }
}