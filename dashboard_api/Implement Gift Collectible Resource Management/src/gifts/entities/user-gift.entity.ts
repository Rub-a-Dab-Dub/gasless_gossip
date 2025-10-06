import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Gift } from "./gift.entity";

@Entity("user_gifts")
@Index(["userId", "giftId"])
@Index(["userId", "acquiredAt"])
export class UserGift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "uuid" })
  giftId: string;

  @ManyToOne(() => Gift, (gift) => gift.userGifts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "giftId" })
  gift: Gift;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ default: false })
  isEquipped: boolean;

  @Column({ type: "varchar", nullable: true })
  acquiredFrom: string; // 'battle', 'gift', 'purchase', 'admin'

  @Column({ type: "uuid", nullable: true })
  giftedByUserId: string;

  @Column({ type: "uuid", nullable: true })
  battleId: string;

  @CreateDateColumn()
  acquiredAt: Date;
}
