import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EventBoostService {
  private isActive: boolean = false;
  private globalFlag: boolean = false; // For A/B testing
  private impactData: { startTime: Date; usersAffected: number }[] = [];

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    if (this.isActive) {
      Logger.log('XP double event is active');
      this.updateImpact();
    }
  }

  activateBoost() {
    if (!this.isActive) {
      this.isActive = true;
      this.impactData.push({ startTime: new Date(), usersAffected: 0 });
      Logger.log('XP double event activated');
    }
  }

  deactivateBoost() {
    if (this.isActive) {
      this.isActive = false;
      Logger.log('XP double event deactivated');
    }
  }

  updateImpact() {
    const currentEvent = this.impactData[this.impactData.length - 1];
    if (currentEvent) {
      currentEvent.usersAffected += 10; // Simulated user count increment
      Logger.log(`Impact updated: ${currentEvent.usersAffected} users affected`);
    }
  }

  deleteEvent() {
    if (this.isActive) {
      this.impactData.pop();
      this.deactivateBoost();
      Logger.log('Event deleted, users notified');
    }
  }

  getReport(): string {
    return this.impactData.length > 0
      ? `Post-event report: ${JSON.stringify(this.impactData)}`
      : 'No events recorded';
  }

  setGlobalFlag(flag: boolean) {
    this.globalFlag = flag;
    Logger.log(`A/B test flag set to: ${flag}`);
  }
}