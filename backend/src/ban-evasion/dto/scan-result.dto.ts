export class ScanResultDto {
  detectedEvasions: {
    walletAddress: string;
    ipHash: string;
    confidence: number;
    evidence: Record<string, any>[];
  }[];
  
  totalScanned: number;
  suspiciousActivities: number;
  timestamp: Date;
  executionTimeMs: number;
}