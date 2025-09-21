import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("visits")
@Index(["roomId", "userId", "createdAt"])
@Index(["roomId", "createdAt"])
export class Visit {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "varchar", length: 255 })
  @Index()
  roomId: string

  @Column({ type: "uuid" })
  @Index()
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress?: string

  @Column({ type: "text", nullable: true })
  userAgent?: string

  @Column({ type: "varchar", length: 255, nullable: true })
  referrer?: string

  @Column({ type: "int", default: 1 })
  duration: number // in seconds

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: "userId" })
  user: User
}
