import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpLog } from './entities/ip-log.entity';
import { BanRecord } from './entities/ban-record.entity';
import { EvasionEvidence } from './entities/evasion-evidence.entity';
import { EvidenceType } from './dto/log-evidence.dto';

interface PatternMatch {
  walletAddress: string;
  ipHash: string;
  confidence: number;
  evidence: {
    type: EvidenceType;
    data: Record<string, any>;
    confidence: number;
  }[];
}

@Injectable()
export class PatternDetectionService {
  private readonly logger = new Logger(PatternDetectionService.name);

  constructor(
    @InjectRepository(IpLog)
    private readonly ipLogRepo: Repository<IpLog>,
    @InjectRepository(BanRecord)
    private readonly banRecordRepo: Repository<BanRecord>,
    @InjectRepository(EvasionEvidence)
    private readonly evidenceRepo: Repository<EvasionEvidence>
  ) {}

  async detectPatterns(timeWindowHours = 24): Promise<PatternMatch[]> {
    const matches: PatternMatch[] = [];
    
    // Get recent IP logs for analysis
    const recentLogs = await this.getRecentLogs(timeWindowHours);
    
    // Group logs by IP hash for analysis
    const ipGroups = this.groupByIpHash(recentLogs);
    
    // Analyze each IP group for suspicious patterns
    for (const [ipHash, logs] of ipGroups.entries()) {
      const ipMatches = await this.analyzeIpGroup(ipHash, logs);
      matches.push(...ipMatches);
    }

    // Deduplicate and sort by confidence
    return this.deduplicateMatches(matches);
  }

  private async getRecentLogs(hours: number) {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    return this.ipLogRepo.createQueryBuilder('log')
      .where('log.timestamp >= :cutoff', { cutoff })
      .orderBy('log.timestamp', 'DESC')
      .getMany();
  }

  private groupByIpHash(logs: IpLog[]): Map<string, IpLog[]> {
    return logs.reduce((groups, log) => {
      const group = groups.get(log.ipHash) || [];
      group.push(log);
      groups.set(log.ipHash, group);
      return groups;
    }, new Map<string, IpLog[]>());
  }

  private async analyzeIpGroup(ipHash: string, logs: IpLog[]): Promise<PatternMatch[]> {
    const matches: PatternMatch[] = [];
    const wallets = new Set(logs.map(log => log.walletAddress));

    // Skip if only one wallet using this IP
    if (wallets.size <= 1) return matches;

    // Check if any wallet in the group is banned
    const bannedWallets = await this.banRecordRepo.find({
      where: { walletAddress: Array.from(wallets) }
    });

    if (bannedWallets.length === 0) return matches;

    // Analyze patterns for each banned wallet
    for (const banned of bannedWallets) {
      const evidence = await this.gatherEvidence(banned, logs, wallets);
      if (evidence.length > 0) {
        matches.push({
          walletAddress: banned.walletAddress,
          ipHash,
          confidence: this.calculateConfidence(evidence),
          evidence
        });
      }
    }

    return matches;
  }

  private async gatherEvidence(
    bannedWallet: BanRecord,
    logs: IpLog[],
    relatedWallets: Set<string>
  ): Promise<PatternMatch['evidence']> {
    const evidence: PatternMatch['evidence'] = [];

    // IP Match Evidence
    evidence.push({
      type: EvidenceType.IP_MATCH,
      data: {
        bannedWallet: bannedWallet.walletAddress,
        relatedWallets: Array.from(relatedWallets),
        logCount: logs.length
      },
      confidence: 0.7 // Base confidence for IP match
    });

    // Behavior Pattern Evidence
    const behaviorPatterns = await this.analyzeBehaviorPatterns(logs, relatedWallets);
    if (behaviorPatterns.confidence > 0) {
      evidence.push({
        type: EvidenceType.BEHAVIOR_PATTERN,
        data: behaviorPatterns.data,
        confidence: behaviorPatterns.confidence
      });
    }

    // Wallet Association Evidence
    const associations = await this.analyzeWalletAssociations(
      bannedWallet.walletAddress,
      Array.from(relatedWallets)
    );
    if (associations.confidence > 0) {
      evidence.push({
        type: EvidenceType.WALLET_ASSOCIATION,
        data: associations.data,
        confidence: associations.confidence
      });
    }

    return evidence;
  }

  private async analyzeBehaviorPatterns(
    logs: IpLog[],
    wallets: Set<string>
  ): Promise<{ confidence: number; data: Record<string, any> }> {
    const actionPatterns = new Map<string, number>();
    
    // Count actions per wallet
    for (const log of logs) {
      const key = \`\${log.walletAddress}:\${log.action}\`;
      actionPatterns.set(key, (actionPatterns.get(key) || 0) + 1);
    }

    // Look for similar patterns across wallets
    const patterns = Array.from(wallets).map(wallet => ({
      wallet,
      pattern: Array.from(actionPatterns.entries())
        .filter(([key]) => key.startsWith(wallet))
        .map(([key, count]) => ({
          action: key.split(':')[1],
          count
        }))
    }));

    // Calculate similarity scores
    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        totalSimilarity += this.calculatePatternSimilarity(
          patterns[i].pattern,
          patterns[j].pattern
        );
        comparisons++;
      }
    }

    const averageSimilarity = comparisons > 0 ? totalSimilarity / comparisons : 0;

    return {
      confidence: averageSimilarity,
      data: {
        walletPatterns: patterns,
        similarityScore: averageSimilarity
      }
    };
  }

  private calculatePatternSimilarity(
    pattern1: { action: string; count: number }[],
    pattern2: { action: string; count: number }[]
  ): number {
    // Simple Jaccard similarity for action types
    const actions1 = new Set(pattern1.map(p => p.action));
    const actions2 = new Set(pattern2.map(p => p.action));
    
    const intersection = new Set(
      [...actions1].filter(x => actions2.has(x))
    );
    
    const union = new Set([...actions1, ...actions2]);
    
    return intersection.size / union.size;
  }

  private async analyzeWalletAssociations(
    bannedWallet: string,
    relatedWallets: string[]
  ): Promise<{ confidence: number; data: Record<string, any> }> {
    // TODO: Implement on-chain analysis for wallet associations
    // This could include:
    // - Common transaction patterns
    // - Shared token holdings
    // - Similar contract interactions
    
    return {
      confidence: 0,
      data: {
        bannedWallet,
        relatedWallets,
        analysisType: 'basic'
      }
    };
  }

  private calculateConfidence(evidence: PatternMatch['evidence']): number {
    if (evidence.length === 0) return 0;

    // Weight different evidence types
    const weights = {
      [EvidenceType.IP_MATCH]: 0.7,
      [EvidenceType.BEHAVIOR_PATTERN]: 0.8,
      [EvidenceType.WALLET_ASSOCIATION]: 0.9,
      [EvidenceType.CUSTOM]: 0.5
    };

    const weightedSum = evidence.reduce((sum, e) => {
      return sum + (e.confidence * (weights[e.type] || 0.5));
    }, 0);

    return Math.min(weightedSum / evidence.length, 1);
  }

  private deduplicateMatches(matches: PatternMatch[]): PatternMatch[] {
    // Group by wallet address and take highest confidence match
    const uniqueMatches = new Map<string, PatternMatch>();
    
    for (const match of matches) {
      const existing = uniqueMatches.get(match.walletAddress);
      if (!existing || existing.confidence < match.confidence) {
        uniqueMatches.set(match.walletAddress, match);
      }
    }

    return Array.from(uniqueMatches.values())
      .sort((a, b) => b.confidence - a.confidence);
  }
}