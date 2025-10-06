import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm"

@Entity("audit_alerts")
@Index(["userId", "createdAt"])
@Index(["status", "severity"])
export class AuditAlert {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  userId: string

  @Column({ type: "varchar", length: 255, nullable: true })
  questId: string

  @Column({ type: "varchar", length: 50 })
  alertType: string // 'duplicate', 'rapid_completion', 'suspicious_pattern', 'ip_abuse'

  @Column({ type: "varchar", length: 50 })
  @Index()
  severity: string // 'low', 'medium', 'high', 'critical'

  @Column({ type: "text" })
  description: string

  @Column({ type: "jsonb" })
  evidence: {
    completionIds?: string[]
    timeWindow?: number
    ipAddresses?: string[]
    metadata?: Record<string, any>
  }

  @Column({ type: "varchar", length: 50, default: "pending" })
  @Index()
  status: string // 'pending', 'investigating', 'resolved', 'false_positive'

  @Column({ type: "varchar", length: 255, nullable: true })
  resolvedBy: string

  @Column({ type: "timestamp", nullable: true })
  resolvedAt: Date

  @Column({ type: "text", nullable: true })
  resolution: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
