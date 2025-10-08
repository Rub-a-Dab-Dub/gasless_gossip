export interface UserSession {
  sessionId: string;
  userId: string;
  adminId?: string; // ID of admin who created this session (if applicable)
  ip: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  isAdmin: boolean;
}

export interface SessionStats {
  totalActiveSessions: number;
  adminSessions: number;
  userSessions: number;
  uniqueIPs: number;
  potentialAnomalies: AnomalyAlert[];
}

export interface AnomalyAlert {
  type: 'multiple_sessions' | 'unusual_ip' | 'rapid_auth' | 'geo_suspicious';
  userId: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface SessionFilter {
  adminId?: string;
  userId?: string;
  ip?: string;
  isAdmin?: boolean;
  from?: Date;
  to?: Date;
}