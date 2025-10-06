import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("rate_limit_abuse_logs")
@Index(["identifier", "createdAt"])
@Index(["endpoint", "createdAt"])
export class RateLimitAbuseLog {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  identifier: string // IP, user ID, etc.

  @Column()
  endpoint: string

  @Column({ nullable: true })
  method: string

  @Column({ type: "int" })
  requestCount: number

  @Column({ type: "int" })
  limitExceeded: number

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>

  @Column()
  severity: "low" | "medium" | "high" | "critical"

  @CreateDateColumn()
  createdAt: Date
}
