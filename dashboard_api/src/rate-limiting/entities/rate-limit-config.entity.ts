import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("rate_limit_configs")
export class RateLimitConfig {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  endpoint: string

  @Column({ nullable: true })
  role: string

  @Column({ type: "int" })
  ttl: number // Time to live in seconds

  @Column({ type: "int" })
  limit: number // Number of requests allowed

  @Column({ type: "int", default: 0 })
  burstLimit: number // Additional burst capacity

  @Column({ default: true })
  isActive: boolean

  @Column({ type: "int", default: 0 })
  priority: number // Higher priority rules are checked first

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
