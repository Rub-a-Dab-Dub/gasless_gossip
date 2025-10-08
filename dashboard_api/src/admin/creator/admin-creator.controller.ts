import { Controller, Post, Body, Param, Get, Query, Patch } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { AdminCreatorService } from './admin-creator.service';

@Controller('admin/creators')
export class AdminCreatorController {
  constructor(private readonly service: AdminCreatorService) {}

  @Post(':userId/upgrade')
  upgrade(@Param('userId') userId: string, @Body() body: { thresholds?: any }) {
    return this.service.upgradeToCreator(userId, body?.thresholds);
  }

  @Patch(':userId/approve')
  approve(@Param('userId') userId: string) {
    return this.service.approveCreator(userId);
  }

  @Patch(':userId/downgrade')
  downgrade(@Param('userId') userId: string) {
    return this.service.downgradeCreator(userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() body: any) {
    return this.service.updateCreator(userId, body);
  }

  @Get(':userId/analytics')
  analytics(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getCreatorAnalytics(userId, startDate, endDate);
  }

  @Get(':userId/evictions')
  evictions(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.listEvictionsByCreator(userId, startDate, endDate);
  }

  // Moderation queue endpoints
  @Get('moderation/queue')
  queue() {
    return this.service.getModerationQueueStatus();
  }

  @Post('moderation/queue')
  submit(@Body() body: { roomId: string; userId: string; voiceNoteUrl: string; content?: string; priority?: 'low'|'medium'|'high'; }) {
    return this.service.submitVoiceForModeration(body);
  }

  @Post('moderation/queue/:itemId/process')
  process(
    @Param('itemId') itemId: string,
    @Body() body: { moderatorId: string; decision: 'approved'|'rejected'; reason?: string }
  ) {
    return this.service.processModerationItem(itemId, body.moderatorId, body.decision, body.reason);
  }

  // Eviction logging
  @Post(':userId/evictions')
  logEviction(
    @Param('userId') creatorId: string,
    @Body() body: { roomId: string; evictedUserId: string; reason: string }
  ) {
    return this.service.logEviction(body.roomId, creatorId, body.evictedUserId, body.reason);
  }

  // Wallet balance sync (ETH example)
  @Post(':userId/wallet/sync')
  syncWallet(@Param('userId') userId: string, @Body() body: { rpcUrl: string }) {
    return this.service.syncWalletBalance(userId, body.rpcUrl);
  }

  @Post(':userId/evaluate')
  evaluate(@Param('userId') userId: string, @Body() body: { rpcUrl?: string }) {
    return this.service.evaluateCreatorStatus(userId, { rpcUrl: body.rpcUrl });
  }

  // Export analytics to PDF
  @Get(':userId/analytics/export')
  async exportAnalytics(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const analytics = await this.service.getCreatorAnalytics(userId, startDate, endDate);
    const uploadsDir = path.join(process.cwd(), 'uploads', 'reports');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, `creator_analytics_${userId}_${Date.now()}.pdf`);
    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      doc.fontSize(16).text('Creator Analytics', { underline: true });
      doc.moveDown();
      doc.fontSize(10).text(JSON.stringify(analytics, null, 2));
      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });
    return { downloadUrl: filePath };
  }
}


