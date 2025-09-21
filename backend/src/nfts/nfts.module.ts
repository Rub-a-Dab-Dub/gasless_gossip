import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { Nft } from "./entities/nft.entity"
import { NftCollection } from "./entities/nft-collection.entity"
import { NftTransferHistory } from "./entities/nft-transfer-history.entity"
import { NftsController } from "./controllers/nfts.controller"
import { CollectionsController } from "./controllers/collections.controller"
import { NftsService } from "./services/nfts.service"
import { StellarNftService } from "./services/stellar-nft.service"
import { TransferLoggerService } from "./services/transfer-logger.service"
import { TransferLoggerListener } from "./listeners/transfer-logger.listener"

@Module({
  imports: [TypeOrmModule.forFeature([Nft, NftCollection, NftTransferHistory]), ConfigModule, EventEmitterModule],
  controllers: [NftsController, CollectionsController],
  providers: [NftsService, StellarNftService, TransferLoggerService, TransferLoggerListener],
  exports: [NftsService, StellarNftService, TransferLoggerService],
})
export class NftsModule {}
