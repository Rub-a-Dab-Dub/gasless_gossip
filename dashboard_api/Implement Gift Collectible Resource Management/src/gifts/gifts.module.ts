import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GiftsController } from "./gifts.controller";
import { GiftsService } from "./gifts.service";
import { Gift } from "./entities/gift.entity";
import { UserGift } from "./entities/user-gift.entity";
import { GiftTransaction } from "./entities/gift-transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Gift, UserGift, GiftTransaction])],
  controllers: [GiftsController],
  providers: [GiftsService],
  exports: [GiftsService],
})
export class GiftsModule {}
