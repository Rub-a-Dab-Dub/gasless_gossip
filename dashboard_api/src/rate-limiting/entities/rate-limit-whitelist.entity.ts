import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity("rate_limit_whitelists")
export class RateLimitWhitelist {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  identifier: string // IP address, user ID, or API key

  @Column()
  type: "ip" | "user" | "apiKey"

  @Column({ nullable: true })
  reason: string

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date
}
