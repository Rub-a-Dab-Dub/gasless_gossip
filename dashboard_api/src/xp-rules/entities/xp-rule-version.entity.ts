import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm"

@Entity("xp_rule_versions")
@Index(["ruleId", "version"])
export class XpRuleVersion {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Index()
  ruleId: string

  @Column({ type: "int" })
  version: number

  @Column({ type: "jsonb" })
  ruleData: {
    ruleName: string
    ruleType: string
    multiplier: number
    baseAmount: number
    conditions: any
    isActive: boolean
    priority: number
    scope: string
  }

  @Column({ type: "text", nullable: true })
  changeDescription: string

  @Column({ type: "varchar", length: 255, nullable: true })
  changedBy: string

  @CreateDateColumn()
  createdAt: Date
}
