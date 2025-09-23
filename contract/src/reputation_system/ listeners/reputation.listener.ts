import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ReputationEventListener {
  private readonly logger = new Logger(ReputationEventListener.name);

  @OnEvent('reputation.changed')
  handleReputationChanged(event: ReputationChangedEvent) {
    this.logger.log(
      `Reputation changed for user ${event.userId}: ${event.oldReputation} -> ${event.newReputation} (${event.reason})`
    );

    // Add additional logic here like:
    // - Send notifications
    // - Update user badges
    // - Trigger other systems
    // - Analytics tracking
  }

  @OnEvent('user.helpful_contribution')
  async handleHelpfulContribution(event: { userId: Address; description?: string }) {
    // Auto-add reputation for helpful contributions
    // This would be injected in the listener
    // await this.reputationService.addHelpfulAnswer(event.userId, event.description);
  }

  @OnEvent('moderation.spam_detected')
  async handleSpamDetected(event: { userId: Address; description?: string }) {
    // Auto-penalize for spam
    // await this.reputationService.penalizeSpam(event.userId, event.description);
  }
}
