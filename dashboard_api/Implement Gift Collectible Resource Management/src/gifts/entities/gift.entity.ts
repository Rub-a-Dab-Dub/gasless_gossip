import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserGift } from "./user-gift.entity";

export enum GiftType {
  BADGE = "badge",
  EMOJI = "emoji",
  STICKER = "sticker",
  ANIMATION = "animation",
}

export enum GiftRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

@Entity("gifts")
export class Gift {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: "enum", enum: GiftType })
  type: GiftType;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "enum", enum: GiftRarity, default: GiftRarity.COMMON })
  rarity: GiftRarity;

  @Column({ type: "int", default: 0 })
  totalMinted: number;

  @Column({ type: "int", nullable: true })
  maxSupply: number; // null = unlimited

  @Column({ type: "int", default: 1 })
  minLevelRequired: number;

  @Column({ type: "jsonb", nullable: true })
  animationConfig: {
    url?: string;
    duration?: number;
    loop?: boolean;
    effects?: string[];
  };

  @Column({ type: "jsonb", nullable: true })
  metadata: {
    imageUrl?: string;
    thumbnailUrl?: string;
    tags?: string[];
    createdBy?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isBattleReward: boolean;

  @Column({ type: "int", default: 0 })
  battleTier: number; // 0 = not battle reward, 1-5 = tier level

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserGift, (userGift) => userGift.gift)
  userGifts: UserGift[];
}
