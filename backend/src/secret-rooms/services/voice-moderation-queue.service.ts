import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface VoiceDropModerationItem {
  id: string;
  voiceDropId: string;
  roomId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  submittedAt: Date;
  processedAt?: Date;
  moderatorId?: string;
  rejectionReason?: string;
  metadata?: {
    audioLength?: number;
    fileSize?: number;
    originalUrl?: string;
    blurredUrl?: string;
    autoModerationScore?: number;
    flaggedContent?: string[];
  };
}

@Injectable()
export class VoiceModerationQueueService {
  private readonly logger = new Logger(VoiceModerationQueueService.name);
  private readonly moderationQueue: Map<string, VoiceDropModerationItem> = new Map();
  private readonly maxQueueSize = 100; // Acceptance criteria: Queue holds 100+ items

  constructor() {}

  /**
   * Add voice drop to moderation queue
   */
  async addToModerationQueue(item: Omit<VoiceDropModerationItem, 'id' | 'submittedAt'>): Promise<string> {
    const id = this.generateUniqueId();
    const moderationItem: VoiceDropModerationItem = {
      id,
      ...item,
      submittedAt: new Date(),
      status: 'pending'
    };

    // Check queue capacity
    if (this.moderationQueue.size >= this.maxQueueSize * 2) {
      this.logger.warn(`Moderation queue is full (${this.moderationQueue.size} items). Removing oldest pending items.`);
      await this.cleanupOldestPendingItems();
    }

    this.moderationQueue.set(id, moderationItem);
    
    this.logger.debug(`Added voice drop ${item.voiceDropId} to moderation queue with priority ${item.priority}`);
    
    return id;
  }

  /**
   * Process moderation queue every minute
   * Acceptance Criteria: Queue processes items efficiently
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processModerationQueue(): Promise<void> {
    const queueSize = this.moderationQueue.size;
    
    if (queueSize === 0) {
      return; // Nothing to process
    }

    if (queueSize > this.maxQueueSize) {
      this.logger.warn(`Moderation queue size (${queueSize}) exceeds recommended limit (${this.maxQueueSize})`);
    }

    // Get pending items sorted by priority and submission time
    const pendingItems = Array.from(this.moderationQueue.values())
      .filter(item => item.status === 'pending')
      .sort((a, b) => {
        // Sort by priority (urgent > high > normal > low) then by time
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
        const aPriority = priorityOrder[a.priority];
        const bPriority = priorityOrder[b.priority];
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher priority first
        }
        
        return a.submittedAt.getTime() - b.submittedAt.getTime(); // Older first
      });

    // Process up to 10 items per minute to avoid overload
    const itemsToProcess = pendingItems.slice(0, 10);
    
    for (const item of itemsToProcess) {
      try {
        await this.processModerationItem(item);
      } catch (error) {
        this.logger.error(`Failed to process moderation item ${item.id}:`, error);
        
        // Mark as failed and retry later
        item.status = 'pending';
        item.metadata = {
          ...item.metadata,
          retryCount: (item.metadata?.retryCount || 0) + 1,
          lastError: error.message
        };
        
        // Remove if too many retries
        if ((item.metadata?.retryCount || 0) > 3) {
          this.moderationQueue.delete(item.id);
          this.logger.warn(`Removed item ${item.id} after multiple failures`);
        }
      }
    }

    this.logger.debug(`Processed ${itemsToProcess.length} moderation items. Queue size: ${this.moderationQueue.size}`);
  }

  /**
   * Process a single moderation item
   */
  private async processModerationItem(item: VoiceDropModerationItem): Promise<void> {
    item.status = 'processing';
    this.moderationQueue.set(item.id, item);

    try {
      // Auto-moderation checks
      const autoModerationResult = await this.performAutoModeration(item);
      
      if (autoModerationResult.shouldAutoApprove) {
        await this.approveVoiceDrop(item, 'auto-moderation');
      } else if (autoModerationResult.shouldAutoReject) {
        await this.rejectVoiceDrop(item, 'auto-moderation', autoModerationResult.reason);
      } else {
        // Requires human moderation - keep in queue with updated metadata
        item.status = 'pending';
        item.priority = autoModerationResult.suggestedPriority || item.priority;
        item.metadata = {
          ...item.metadata,
          autoModerationScore: autoModerationResult.score,
          flaggedContent: autoModerationResult.flaggedContent,
          requiresHumanReview: true
        };
        
        this.moderationQueue.set(item.id, item);
      }
    } catch (error) {
      throw new Error(`Failed to process moderation for item ${item.id}: ${error.message}`);
    }
  }

  /**
   * Perform automatic moderation checks
   */
  private async performAutoModeration(item: VoiceDropModerationItem): Promise<{
    shouldAutoApprove: boolean;
    shouldAutoReject: boolean;
    score: number;
    reason?: string;
    suggestedPriority?: 'low' | 'normal' | 'high' | 'urgent';
    flaggedContent?: string[];
  }> {
    let score = 0;
    const flaggedContent: string[] = [];

    // Check audio length (very short or very long might be suspicious)
    if (item.metadata?.audioLength) {
      if (item.metadata.audioLength < 1) {
        score += 30; // Suspiciously short
        flaggedContent.push('very_short_audio');
      } else if (item.metadata.audioLength > 300) {
        score += 20; // Longer than 5 minutes
        flaggedContent.push('long_audio');
      }
    }

    // Check file size anomalies
    if (item.metadata?.fileSize) {
      if (item.metadata.fileSize > 50 * 1024 * 1024) { // 50MB
        score += 25;
        flaggedContent.push('large_file_size');
      }
    }

    // TODO: Add more sophisticated checks:
    // - Audio content analysis for inappropriate content
    // - User reputation score
    // - Room context analysis
    // - Previous moderation history

    // Simple rules for auto-decision
    const shouldAutoApprove = score < 10 && flaggedContent.length === 0;
    const shouldAutoReject = score > 80;
    
    let suggestedPriority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
    if (score > 60) suggestedPriority = 'high';
    if (score > 80) suggestedPriority = 'urgent';
    if (score < 20) suggestedPriority = 'low';

    return {
      shouldAutoApprove,
      shouldAutoReject,
      score,
      reason: shouldAutoReject ? `Auto-rejected: score ${score}, flags: ${flaggedContent.join(', ')}` : undefined,
      suggestedPriority,
      flaggedContent
    };
  }

  /**
   * Approve a voice drop
   */
  private async approveVoiceDrop(item: VoiceDropModerationItem, moderatorId: string): Promise<void> {
    item.status = 'approved';
    item.processedAt = new Date();
    item.moderatorId = moderatorId;
    
    this.moderationQueue.set(item.id, item);
    
    // TODO: Integrate with VoiceDropsService to make the voice drop live
    // await this.voiceDropsService.publishVoiceDrop(item.voiceDropId);
    
    this.logger.log(`Approved voice drop ${item.voiceDropId} by ${moderatorId}`);
    
    // Remove from queue after successful processing
    setTimeout(() => {
      this.moderationQueue.delete(item.id);
    }, 5 * 60 * 1000); // Keep for 5 minutes for audit
  }

  /**
   * Reject a voice drop
   */
  private async rejectVoiceDrop(item: VoiceDropModerationItem, moderatorId: string, reason: string): Promise<void> {
    item.status = 'rejected';
    item.processedAt = new Date();
    item.moderatorId = moderatorId;
    item.rejectionReason = reason;
    
    this.moderationQueue.set(item.id, item);
    
    // TODO: Integrate with VoiceDropsService to remove/hide the voice drop
    // await this.voiceDropsService.hideVoiceDrop(item.voiceDropId, reason);
    
    this.logger.log(`Rejected voice drop ${item.voiceDropId} by ${moderatorId}: ${reason}`);
    
    // Remove from queue after successful processing
    setTimeout(() => {
      this.moderationQueue.delete(item.id);
    }, 30 * 60 * 1000); // Keep for 30 minutes for audit
  }

  /**
   * Get moderation queue statistics
   */
  getQueueStats(): {
    totalItems: number;
    pending: number;
    processing: number;
    capacity: number;
    capacityUsed: number;
  } {
    const items = Array.from(this.moderationQueue.values());
    
    return {
      totalItems: items.length,
      pending: items.filter(item => item.status === 'pending').length,
      processing: items.filter(item => item.status === 'processing').length,
      capacity: this.maxQueueSize,
      capacityUsed: Math.round((items.length / this.maxQueueSize) * 100)
    };
  }

  /**
   * Get pending moderation items for admin interface
   */
  getPendingModerationItems(limit: number = 20): VoiceDropModerationItem[] {
    return Array.from(this.moderationQueue.values())
      .filter(item => item.status === 'pending')
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Manual moderation action by admin
   */
  async moderateItem(itemId: string, action: 'approve' | 'reject', moderatorId: string, reason?: string): Promise<void> {
    const item = this.moderationQueue.get(itemId);
    if (!item) {
      throw new Error(`Moderation item ${itemId} not found`);
    }

    if (action === 'approve') {
      await this.approveVoiceDrop(item, moderatorId);
    } else {
      await this.rejectVoiceDrop(item, moderatorId, reason || 'Manually rejected');
    }
  }

  /**
   * Clean up oldest pending items when queue is full
   */
  private async cleanupOldestPendingItems(): Promise<void> {
    const pendingItems = Array.from(this.moderationQueue.values())
      .filter(item => item.status === 'pending')
      .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());

    // Remove oldest 20% of pending items
    const itemsToRemove = pendingItems.slice(0, Math.ceil(pendingItems.length * 0.2));
    
    for (const item of itemsToRemove) {
      this.moderationQueue.delete(item.id);
      this.logger.warn(`Auto-removed old pending moderation item: ${item.id}`);
    }
  }

  /**
   * Generate unique ID for moderation items
   */
  private generateUniqueId(): string {
    return `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}