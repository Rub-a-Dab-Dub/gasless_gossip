export interface Cohort {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: CohortType;
  userCount: number;
  filters?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RetentionDataPoint {
  period: number;
  retainedUsers: number;
  retentionRate: number;
  churnedUsers: number;
  churnRate: number;
}

export interface FeatureAttribution {
  feature: string;
  correlation: number;
  impact: 'positive' | 'negative';
  users: number;
}

export interface ChurnPrediction {
  userId: string;
  riskScore: number;
  riskLevel: ChurnRiskLevel;
  contributingFactors: string[];
  lastActive: Date;
  predictedChurnDate: Date;
}

// ==================== SERVICE ====================
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class ChurnAnalyticsService {
  private cohorts: Map<string, Cohort> = new Map();
  private userData: Map<string, any> = new Map(); // Mock user data
  private alertThreshold = 0.15; // 15% drop triggers alert

  constructor() {
    this.seedMockData();
  }

  // CREATE: Generate cohort
  async createCohort(dto: CreateCohortDto): Promise<Cohort> {
    const id = `cohort_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const cohort: Cohort = {
      id,
      name: dto.name,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      type: dto.type,
      userCount: this.calculateCohortSize(dto),
      filters: dto.filters,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cohorts.set(id, cohort);
    return cohort;
  }

  // READ: Get retention curves
  async getRetentionCurves(cohortId: string): Promise<{
    cohort: Cohort;
    retentionData: RetentionDataPoint[];
    chartData: any;
    featureAttribution: FeatureAttribution[];
    alerts: any[];
  }> {
    const cohort = this.cohorts.get(cohortId);
    if (!cohort) {
      throw new NotFoundException(`Cohort ${cohortId} not found`);
    }

    const retentionData = this.calculateRetentionCurve(cohort);
    const featureAttribution = this.calculateFeatureAttribution(cohort);
    const alerts = this.checkRetentionAlerts(retentionData);

    return {
      cohort,
      retentionData,
      chartData: this.formatChartData(retentionData),
      featureAttribution,
      alerts,
    };
  }

  // UPDATE: Drill-down segments
  async drillDownSegments(cohortId: string, dto: DrillDownSegmentDto): Promise<{
    segments: any[];
    retentionComparison: any;
    insights: string[];
  }> {
    const cohort = this.cohorts.get(cohortId);
    if (!cohort) {
      throw new NotFoundException(`Cohort ${cohortId} not found`);
    }

    const segments = this.generateSegments(cohort, dto);
    const retentionComparison = this.compareSegmentRetention(segments);
    const insights = this.generateInsights(segments, retentionComparison);

    // Update cohort with drill-down info
    cohort.updatedAt = new Date();
    this.cohorts.set(cohortId, cohort);

    return {
      segments,
      retentionComparison,
      insights,
    };
  }

  // DELETE: Predict churn (remove users from active analysis)
  async predictChurn(dto: PredictChurnDto): Promise<{
    predictions: ChurnPrediction[];
    summary: any;
    recommendations: string[];
  }> {
    const predictions = this.calculateChurnPredictions(dto);
    
    // Filter by risk level if specified
    let filteredPredictions = predictions;
    if (dto.minRiskLevel) {
      const riskLevels = [ChurnRiskLevel.LOW, ChurnRiskLevel.MEDIUM, ChurnRiskLevel.HIGH, ChurnRiskLevel.CRITICAL];
      const minIndex = riskLevels.indexOf(dto.minRiskLevel);
      filteredPredictions = predictions.filter(p => 
        riskLevels.indexOf(p.riskLevel) >= minIndex
      );
    }

    const summary = this.generateChurnSummary(filteredPredictions);
    const recommendations = this.generateRecommendations(filteredPredictions);

    return {
      predictions: filteredPredictions,
      summary,
      recommendations,
    };
  }

  // List all cohorts
  async listCohorts(): Promise<Cohort[]> {
    return Array.from(this.cohorts.values());
  }

  // Delete cohort
  async deleteCohort(cohortId: string): Promise<void> {
    if (!this.cohorts.has(cohortId)) {
      throw new NotFoundException(`Cohort ${cohortId} not found`);
    }
    this.cohorts.delete(cohortId);
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private calculateCohortSize(dto: CreateCohortDto): number {
    // Mock calculation - in real implementation, query database
    return Math.floor(Math.random() * 5000) + 1000;
  }

  private calculateRetentionCurve(cohort: Cohort): RetentionDataPoint[] {
    const periods = cohort.type === CohortType.DAILY ? 30 : 
                   cohort.type === CohortType.WEEKLY ? 12 : 6;
    
    const data: RetentionDataPoint[] = [];
    let retainedUsers = cohort.userCount;

    for (let i = 0; i <= periods; i++) {
      const churnRate = 0.08 + (i * 0.02) + (Math.random() * 0.05);
      const churned = Math.floor(retainedUsers * churnRate);
      retainedUsers -= churned;

      data.push({
        period: i,
        retainedUsers,
        retentionRate: retainedUsers / cohort.userCount,
        churnedUsers: churned,
        churnRate,
      });
    }

    return data;
  }

  private calculateFeatureAttribution(cohort: Cohort): FeatureAttribution[] {
    const features = [
      { feature: 'gifting_loops', correlation: 0.72, impact: 'positive' as const },
      { feature: 'daily_login_streak', correlation: 0.65, impact: 'positive' as const },
      { feature: 'social_sharing', correlation: 0.58, impact: 'positive' as const },
      { feature: 'onboarding_completion', correlation: 0.81, impact: 'positive' as const },
      { feature: 'payment_failures', correlation: -0.45, impact: 'negative' as const },
      { feature: 'support_tickets', correlation: -0.38, impact: 'negative' as const },
    ];

    return features.map(f => ({
      ...f,
      users: Math.floor(cohort.userCount * (Math.random() * 0.4 + 0.3)),
    }));
  }

  private checkRetentionAlerts(data: RetentionDataPoint[]): any[] {
    const alerts: any[] = [];

    for (let i = 1; i < data.length; i++) {
      const drop = data[i - 1].retentionRate - data[i].retentionRate;
      
      if (drop > this.alertThreshold) {
        alerts.push({
          period: i,
          severity: 'high',
          message: `Sharp retention drop detected: ${(drop * 100).toFixed(1)}% decline`,
          retentionBefore: data[i - 1].retentionRate,
          retentionAfter: data[i].retentionRate,
          affectedUsers: data[i].churnedUsers,
        });
      }
    }

    return alerts;
  }

  private formatChartData(data: RetentionDataPoint[]): any {
    return {
      labels: data.map(d => `Period ${d.period}`),
      datasets: [
        {
          label: 'Retention Rate',
          data: data.map(d => (d.retentionRate * 100).toFixed(2)),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
        {
          label: 'Churn Rate',
          data: data.map(d => (d.churnRate * 100).toFixed(2)),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
      metadata: {
        totalPeriods: data.length,
        startRetention: data[0].retentionRate,
        endRetention: data[data.length - 1].retentionRate,
        averageChurnRate: data.reduce((sum, d) => sum + d.churnRate, 0) / data.length,
      },
    };
  }

  private generateSegments(cohort: Cohort, dto: DrillDownSegmentDto): any[] {
    const segments = [
      {
        name: 'High Engagement',
        userCount: Math.floor(cohort.userCount * 0.35),
        avgRetention: 0.78,
        features: { gifting_loops: 8.2, daily_logins: 24 },
      },
      {
        name: 'Medium Engagement',
        userCount: Math.floor(cohort.userCount * 0.45),
        avgRetention: 0.52,
        features: { gifting_loops: 3.5, daily_logins: 12 },
      },
      {
        name: 'Low Engagement',
        userCount: Math.floor(cohort.userCount * 0.20),
        avgRetention: 0.21,
        features: { gifting_loops: 0.8, daily_logins: 3 },
      },
    ];

    if (dto.minRetention) {
      return segments.filter(s => s.avgRetention >= dto.minRetention);
    }

    return segments;
  }

  private compareSegmentRetention(segments: any[]): any {
    return {
      highestRetention: segments.reduce((max, s) => s.avgRetention > max.avgRetention ? s : max),
      lowestRetention: segments.reduce((min, s) => s.avgRetention < min.avgRetention ? s : min),
      retentionSpread: Math.max(...segments.map(s => s.avgRetention)) - 
                       Math.min(...segments.map(s => s.avgRetention)),
    };
  }

  private generateInsights(segments: any[], comparison: any): string[] {
    return [
      `${comparison.highestRetention.name} segment shows ${(comparison.highestRetention.avgRetention * 100).toFixed(1)}% retention`,
      `Retention spread of ${(comparison.retentionSpread * 100).toFixed(1)}% indicates segmentation opportunities`,
      `Gifting loops correlation: High engagement users average ${comparison.highestRetention.features.gifting_loops} loops vs ${comparison.lowestRetention.features.gifting_loops} in low engagement`,
      `Focus on converting medium engagement users to improve overall retention`,
    ];
  }

  private calculateChurnPredictions(dto: PredictChurnDto): ChurnPrediction[] {
    const userIds = dto.userIds || this.generateMockUserIds(100);
    const daysAhead = dto.daysAhead || 30;

    return userIds.map(userId => {
      const riskScore = Math.random();
      const riskLevel = this.getRiskLevel(riskScore);
      const factors = this.getChurnFactors(riskScore);

      return {
        userId,
        riskScore,
        riskLevel,
        contributingFactors: factors,
        lastActive: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        predictedChurnDate: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000),
      };
    });
  }

  private getRiskLevel(score: number): ChurnRiskLevel {
    if (score < 0.25) return ChurnRiskLevel.LOW;
    if (score < 0.5) return ChurnRiskLevel.MEDIUM;
    if (score < 0.75) return ChurnRiskLevel.HIGH;
    return ChurnRiskLevel.CRITICAL;
  }

  private getChurnFactors(score: number): string[] {
    const allFactors = [
      'Low engagement with gifting loops',
      'Declining login frequency',
      'No social connections',
      'Payment issues',
      'Support ticket history',
      'Feature adoption lag',
      'Reduced session duration',
    ];

    const count = Math.ceil(score * 5);
    return allFactors.slice(0, count);
  }

  private generateChurnSummary(predictions: ChurnPrediction[]): any {
    const byRisk = predictions.reduce((acc, p) => {
      acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: predictions.length,
      byRiskLevel: byRisk,
      averageRiskScore: predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length,
      highRiskCount: predictions.filter(p => 
        p.riskLevel === ChurnRiskLevel.HIGH || p.riskLevel === ChurnRiskLevel.CRITICAL
      ).length,
    };
  }

  private generateRecommendations(predictions: ChurnPrediction[]): string[] {
    const highRisk = predictions.filter(p => p.riskLevel === ChurnRiskLevel.HIGH || 
                                             p.riskLevel === ChurnRiskLevel.CRITICAL);
    
    return [
      `${highRisk.length} users at high risk - implement retention campaign`,
      'Increase gifting loop incentives for low-engagement segments',
      'Send re-engagement emails to users inactive >7 days',
      'Offer personalized onboarding for users with low feature adoption',
      'Monitor payment failure rates and proactive support outreach',
    ];
  }

  private generateMockUserIds(count: number): string[] {
    return Array.from({ length: count }, (_, i) => 
      `user_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`
    );
  }

  private seedMockData(): void {
    // Seed some initial cohorts for testing
    this.cohorts.set('cohort_jan_2025', {
      id: 'cohort_jan_2025',
      name: 'January 2025 Users',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
      type: CohortType.MONTHLY,
      userCount: 4523,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
