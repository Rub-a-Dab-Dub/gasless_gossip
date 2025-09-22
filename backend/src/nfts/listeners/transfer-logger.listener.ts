import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import type { TransferLoggerService } from "../services/transfer-logger.service"
import type { NftMintedEvent } from "../events/nft-minted.event"
import type { NftTransferredEvent } from "../events/nft-transferred.event"

@Injectable()
export class TransferLoggerListener {
  private readonly logger = new Logger(TransferLoggerListener.name)

  constructor(private transferLoggerService: TransferLoggerService) {}

  @OnEvent("nft.minted")
  async handleNftMinted(event: NftMintedEvent) {
    try {
      this.logger.log(`Handling NFT minted event for NFT ${event.nft.id}`)

      await this.transferLoggerService.logTransfer({
        nftId!: event.nft.id,
        fromAddress!: "mint",
        toAddress: event.nft.user?.stellarAccountId || "unknown",
        toUserId: event.nft.userId,
        transactionId: event.nft.txId,
        transferType: "mint",
        timestamp: event.nft.createdAt,
        metadata: {
          mintPrice: event.nft.mintPrice,
          collectionId: event.nft.collectionId,
        },
      })
    } catch (error) {
      this.logger.error(`Failed to log NFT mint: ${error.message}`, error.stack)
    }
  }

  @OnEvent("nft.transferred")
  async handleNftTransferred(event: NftTransferredEvent) {
    try {
      this.logger.log(`Handling NFT transferred event for NFT ${event.nft.id}`)

      // Get the latest transfer log to extract transaction ID
      const latestTransferLog = event.nft.transferLogs[event.nft.transferLogs.length - 1]

      await this.transferLoggerService.logTransfer({
        nftId: event.nft.id,
        fromAddress: "unknown", // Would need to get from user's Stellar account
        toAddress: "unknown", // Would need to get from user's Stellar account
        fromUserId: event.fromUserId,
        toUserId: event.toUserId,
        transactionId: latestTransferLog.transactionId,
        transferType: "transfer",
        timestamp: latestTransferLog.timestamp,
        metadata: {
          previousOwner: event.fromUserId,
          newOwner: event.toUserId,
        },
      })
    } catch (error) {
      this.logger.error(`Failed to log NFT transfer: ${error.message}`, error.stack)
    }
  }

  @OnEvent("nft.transfer.logged")
  async handleTransferLogged(event: { nftId: string; transferHistory: any }) {
    this.logger.log(`Transfer logged for NFT ${event.nftId}`)

    // Could trigger additional actions like:
    // - Updating analytics
    // - Sending notifications
    // - Updating caches
    // - Triggering webhooks
  }
}
