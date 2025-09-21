import { Injectable, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { EventEmitter2 } from "@nestjs/event-emitter"
import type { Nft, NftTransferLog } from "../entities/nft.entity"
import type { NftTransferHistory } from "../entities/nft-transfer-history.entity"
import type { StellarNftService } from "./stellar-nft.service"

export interface TransferLogEntry {
  nftId: string
  fromAddress: string
  toAddress: string
  fromUserId?: string
  toUserId?: string
  transactionId: string
  blockNumber?: number
  gasUsed?: number
  transferType: "mint" | "transfer" | "burn"
  timestamp: Date
  metadata?: Record<string, any>
}

@Injectable()
export class TransferLoggerService {
  private readonly logger = new Logger(TransferLoggerService.name)

  constructor(
    private nftRepository: Repository<Nft>,
    private transferHistoryRepository: Repository<NftTransferHistory>,
    private stellarNftService: StellarNftService,
    private eventEmitter: EventEmitter2,
  ) {}

  async logTransfer(entry: TransferLogEntry): Promise<void> {
    try {
      this.logger.log(`Logging transfer for NFT ${entry.nftId}: ${entry.fromAddress} -> ${entry.toAddress}`)

      // Create transfer history record
      const transferHistory = this.transferHistoryRepository.create({
        nftId: entry.nftId,
        fromAddress: entry.fromAddress,
        toAddress: entry.toAddress,
        fromUserId: entry.fromUserId,
        toUserId: entry.toUserId,
        transactionId: entry.transactionId,
        blockNumber: entry.blockNumber,
        gasUsed: entry.gasUsed,
        transferType: entry.transferType,
        timestamp: entry.timestamp,
        metadata: entry.metadata,
      })

      await this.transferHistoryRepository.save(transferHistory)

      // Update NFT's transfer logs
      const nft = await this.nftRepository.findOne({ where: { id: entry.nftId } })
      if (nft) {
        const transferLog: NftTransferLog = {
          from: entry.fromUserId || entry.fromAddress,
          to: entry.toUserId || entry.toAddress,
          timestamp: entry.timestamp,
          transactionId: entry.transactionId,
          blockNumber: entry.blockNumber,
        }

        nft.transferLogs.push(transferLog)
        await this.nftRepository.save(nft)
      }

      // Emit event for real-time updates
      this.eventEmitter.emit("nft.transfer.logged", {
        nftId: entry.nftId,
        transferHistory,
      })

      this.logger.log(`Transfer logged successfully for NFT ${entry.nftId}`)
    } catch (error) {
      this.logger.error(`Failed to log transfer for NFT ${entry.nftId}: ${error.message}`, error.stack)
      throw error
    }
  }

  async getTransferHistory(nftId: string): Promise<NftTransferHistory[]> {
    return this.transferHistoryRepository.find({
      where: { nftId },
      order: { timestamp: "DESC" },
    })
  }

  async getTransferHistoryByUser(userId: string): Promise<NftTransferHistory[]> {
    return this.transferHistoryRepository.find({
      where: [{ fromUserId: userId }, { toUserId: userId }],
      order: { timestamp: "DESC" },
    })
  }

  async getTransferHistoryByAddress(address: string): Promise<NftTransferHistory[]> {
    return this.transferHistoryRepository.find({
      where: [{ fromAddress: address }, { toAddress: address }],
      order: { timestamp: "DESC" },
    })
  }

  async syncTransferFromStellar(transactionId: string): Promise<void> {
    try {
      this.logger.log(`Syncing transfer from Stellar transaction: ${transactionId}`)

      // Get transaction details from Stellar
      const txDetails = await this.stellarNftService.getTransactionDetails(transactionId)
      if (!txDetails) {
        throw new Error(`Transaction ${transactionId} not found on Stellar`)
      }

      // Parse transaction operations to extract transfer information
      const operations = txDetails.operations || []

      for (const operation of operations) {
        if (operation.type === "payment" && operation.asset_type !== "native") {
          // This is an asset transfer (potentially an NFT)
          const assetCode = operation.asset_code
          const assetIssuer = operation.asset_issuer

          // Find the NFT in our database
          const nft = await this.nftRepository.findOne({
            where: {
              stellarAssetCode: assetCode,
              stellarAssetIssuer: assetIssuer,
            },
          })

          if (nft) {
            // Log the transfer
            await this.logTransfer({
              nftId: nft.id,
              fromAddress: operation.from,
              toAddress: operation.to,
              transactionId: transactionId,
              transferType: "transfer",
              timestamp: new Date(txDetails.created_at),
              metadata: {
                stellarLedger: txDetails.ledger,
                stellarPagingToken: txDetails.paging_token,
              },
            })

            // Update NFT ownership if we can map addresses to users
            // This would require additional logic to map Stellar addresses to user IDs
          }
        }
      }

      this.logger.log(`Successfully synced transfer from Stellar transaction: ${transactionId}`)
    } catch (error) {
      this.logger.error(`Failed to sync transfer from Stellar: ${error.message}`, error.stack)
      throw error
    }
  }

  async validateTransferIntegrity(nftId: string): Promise<boolean> {
    try {
      const nft = await this.nftRepository.findOne({ where: { id: nftId } })
      if (!nft) {
        return false
      }

      const transferHistory = await this.getTransferHistory(nftId)

      // Validate that transfer logs match transfer history
      if (nft.transferLogs.length !== transferHistory.length) {
        this.logger.warn(
          `Transfer log mismatch for NFT ${nftId}: ${nft.transferLogs.length} vs ${transferHistory.length}`,
        )
        return false
      }

      // Validate chronological order
      for (let i = 1; i < transferHistory.length; i++) {
        if (transferHistory[i].timestamp > transferHistory[i - 1].timestamp) {
          this.logger.warn(`Transfer history out of order for NFT ${nftId}`)
          return false
        }
      }

      // Validate that the last transfer matches current ownership
      const lastTransfer = transferHistory[0]
      if (lastTransfer && lastTransfer.toUserId !== nft.userId) {
        this.logger.warn(`Ownership mismatch for NFT ${nftId}: ${lastTransfer.toUserId} vs ${nft.userId}`)
        return false
      }

      return true
    } catch (error) {
      this.logger.error(`Failed to validate transfer integrity for NFT ${nftId}: ${error.message}`)
      return false
    }
  }

  async getTransferStatistics(timeframe: "day" | "week" | "month" | "year" = "day") {
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case "day":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
    }

    const transfers = await this.transferHistoryRepository
      .createQueryBuilder("transfer")
      .where("transfer.timestamp >= :startDate", { startDate })
      .getMany()

    const stats = {
      totalTransfers: transfers.length,
      mints: transfers.filter((t) => t.transferType === "mint").length,
      transfers: transfers.filter((t) => t.transferType === "transfer").length,
      burns: transfers.filter((t) => t.transferType === "burn").length,
      uniqueNfts: new Set(transfers.map((t) => t.nftId)).size,
      uniqueUsers: new Set([
        ...transfers.map((t) => t.fromUserId).filter(Boolean),
        ...transfers.map((t) => t.toUserId).filter(Boolean),
      ]).size,
    }

    return stats
  }
}
