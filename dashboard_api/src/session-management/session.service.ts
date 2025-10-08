import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { AnomalyAlert, SessionFilter, SessionStats, UserSession } from './session.types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SessionService implements OnModuleInit {
  private readonly redis: Redis;
  private readonly sessionTTL: number = 24 * 60 * 60; // 24 hours default TTL
  private readonly anomalyThresholds = {
    maxSessionsPerUser: 5,
    rapidAuthInterval: 60, // seconds
    rapidAuthCount: 3,
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async onModuleInit() {
    // Ensure Redis connection
    await this.redis.ping();
  }

  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  private getUserSessionsKey(userId: string): string {
    return `user-sessions:${userId}`;
  }

  private getAdminSessionsKey(adminId: string): string {
    return `admin-sessions:${adminId}`;
  }

  async createSession(session: Omit<UserSession, 'sessionId'>): Promise<UserSession> {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const newSession: UserSession = {
      ...session,
      sessionId,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    const sessionKey = this.getSessionKey(sessionId);
    await this.redis.setex(
      sessionKey,
      this.sessionTTL,
      JSON.stringify(newSession)
    );

    // Add to user's session list
    await this.redis.sadd(
      this.getUserSessionsKey(session.userId),
      sessionId
    );

    if (session.adminId) {
      await this.redis.sadd(
        this.getAdminSessionsKey(session.adminId),
        sessionId
      );
    }

    await this.checkForAnomalies(session.userId, session.ip);

    return newSession;
  }

  async getSessions(filter: SessionFilter): Promise<UserSession[]> {
    const sessions: UserSession[] = [];
    let sessionIds: string[] = [];

    if (filter.adminId) {
      sessionIds = await this.redis.smembers(
        this.getAdminSessionsKey(filter.adminId)
      );
    } else if (filter.userId) {
      sessionIds = await this.redis.smembers(
        this.getUserSessionsKey(filter.userId)
      );
    } else {
      const keys = await this.redis.keys('session:*');
      sessionIds = keys.map(key => key.replace('session:', ''));
    }

    for (const sessionId of sessionIds) {
      const session = await this.getSession(sessionId);
      if (session &&
          (!filter.ip || session.ip === filter.ip) &&
          (!filter.isAdmin || session.isAdmin === filter.isAdmin) &&
          (!filter.from || new Date(session.createdAt) >= filter.from) &&
          (!filter.to || new Date(session.createdAt) <= filter.to)) {
        sessions.push(session);
      }
    }

    return sessions;
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    const data = await this.redis.get(this.getSessionKey(sessionId));
    return data ? JSON.parse(data) : null;
  }

  async terminateSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    if (!session) return false;

    await this.redis.del(this.getSessionKey(sessionId));
    await this.redis.srem(
      this.getUserSessionsKey(session.userId),
      sessionId
    );

    if (session.adminId) {
      await this.redis.srem(
        this.getAdminSessionsKey(session.adminId),
        sessionId
      );
    }

    return true;
  }

  async terminateAllSessions(): Promise<number> {
    const keys = await this.redis.keys('session:*');
    if (keys.length === 0) return 0;

    await this.redis.del(...keys);
    await this.redis.del(await this.redis.keys('user-sessions:*'));
    await this.redis.del(await this.redis.keys('admin-sessions:*'));

    return keys.length;
  }

  async getStats(): Promise<SessionStats> {
    const allSessions = await this.getSessions({});
    const uniqueIPs = new Set(allSessions.map(s => s.ip));
    const adminSessions = allSessions.filter(s => s.isAdmin);
    const userSessions = allSessions.filter(s => !s.isAdmin);
    const anomalies = await this.detectAnomalies(allSessions);

    return {
      totalActiveSessions: allSessions.length,
      adminSessions: adminSessions.length,
      userSessions: userSessions.length,
      uniqueIPs: uniqueIPs.size,
      potentialAnomalies: anomalies,
    };
  }

  private async checkForAnomalies(userId: string, ip: string): Promise<void> {
    const userSessions = await this.getSessions({ userId });
    const alerts: AnomalyAlert[] = [];

    // Check for multiple sessions
    if (userSessions.length > this.anomalyThresholds.maxSessionsPerUser) {
      alerts.push({
        type: 'multiple_sessions',
        userId,
        details: `User has ${userSessions.length} active sessions`,
        severity: 'medium',
        timestamp: new Date(),
      });
    }

    // Check for rapid authentication
    const recentSessions = userSessions.filter(
      s => (new Date().getTime() - new Date(s.createdAt).getTime()) / 1000 
          <= this.anomalyThresholds.rapidAuthInterval
    );

    if (recentSessions.length >= this.anomalyThresholds.rapidAuthCount) {
      alerts.push({
        type: 'rapid_auth',
        userId,
        details: `${recentSessions.length} sessions created in ${this.anomalyThresholds.rapidAuthInterval} seconds`,
        severity: 'high',
        timestamp: new Date(),
      });
    }

    // Emit alerts
    for (const alert of alerts) {
      this.eventEmitter.emit('session.anomaly', alert);
    }
  }

  private async detectAnomalies(sessions: UserSession[]): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];
    const userSessionCounts = new Map<string, number>();
    const userIPs = new Map<string, Set<string>>();

    for (const session of sessions) {
      // Count sessions per user
      userSessionCounts.set(
        session.userId,
        (userSessionCounts.get(session.userId) || 0) + 1
      );

      // Track IPs per user
      if (!userIPs.has(session.userId)) {
        userIPs.set(session.userId, new Set());
      }
      userIPs.get(session.userId)?.add(session.ip);
    }

    // Check for anomalies
    for (const [userId, count] of userSessionCounts) {
      if (count > this.anomalyThresholds.maxSessionsPerUser) {
        alerts.push({
          type: 'multiple_sessions',
          userId,
          details: `User has ${count} active sessions`,
          severity: 'medium',
          timestamp: new Date(),
        });
      }

      const uniqueIPs = userIPs.get(userId)?.size || 0;
      if (uniqueIPs > 3) { // More than 3 different IPs
        alerts.push({
          type: 'unusual_ip',
          userId,
          details: `User accessing from ${uniqueIPs} different IPs`,
          severity: 'high',
          timestamp: new Date(),
        });
      }
    }

    return alerts;
  }
}