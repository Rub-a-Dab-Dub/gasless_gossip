import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("xp_simulations")
@Index(["simulationId", "createdAt"])
export class XpSimulation {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  simulationId: string

  @Column({ type: "varchar", length: 255 })
  simulationName: string

  @Column({ type: "jsonb" })
  ruleChanges: Array<{
    ruleId: string
    ruleName: string
    oldMultiplier: number
    newMultiplier: number
    oldBaseAmount: number
    newBaseAmount: number
  }>

  @Column({ type: "jsonb" })
  impactAnalysis: {
    affectedUsers: number
    avgXpChange: number
    minXpChange: number
    maxXpChange: number
    totalXpImpact: number
    levelDistributionChange: Record<string, number>
  }

  @Column({ type: "varchar", length: 50 })
  status: string // 'pending', 'running', 'completed', 'applied'

  @Column({ type: "varchar", length: 255, nullable: true })
  createdBy: string

  @Column({ type: "timestamp", nullable: true })
  appliedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
