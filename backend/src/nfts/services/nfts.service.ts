import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { EventEmitter2 } from "@nestjs/event-emitter"
import type { Nft, NftMetadata } from "../entities/nft.entity"
import type { NftCollection } from "../entities/nft-collection.entity"
import type { StellarNftService } from "./stellar-nft.service"
import type { UpdateNftDto } from "../dto/update-nft.dto"
import { NftMintedEvent } from "../events/nft-minted.event"
import { NftTransferredEvent } from "../events/nft-transferred.event"

export interface MintNftOptions {
  userId: string
  metadata: NftMetadata
  recipientStellarAddress: string
  collectionId?: string
  mintPrice?: string
}

export interface TransferNftOptions {
  nftId: string
  fromUserId: string
  toUserId: string
  toStellarAddress: string
}

@Injectable()
export class NftsService {
  private readonly logger = new Logger(NftsService.name)

  constructor(
    private nftRepository: Repository<Nft>,
    private collectionRepository: Repository<NftCollection>,
    private stellarNftService: StellarNftService,
    private eventEmitter: EventEmitter2,
  ) {}

  async mintNft(options: MintNftOptions): Promise<Nft> {
    const { userId, metadata, recipientStellarAddress, collectionId, mintPrice } = options

    try {
      this.logger.log(`Minting NFT for user ${userId}`)

      // Validate metadata
      this.validateMetadata(metadata)

      // Get collection info if provided
      let collection: NftCollection | null = null
      if (collectionId) {
        collection = await this.collectionRepository.findOne({ where: { id: collectionId } })
        if (!collection) {
          throw new NotFoundException(`Collection with ID ${collectionId} not found`)
        }
      }

      // Mint NFT on Stellar
      const mintResult = await this.stellarNftService.mintNft(
        recipientStellarAddress,
        metadata,
        collection?.symbol || "WHISPER",
      )

      // Create NFT record in database
      const nft = this.nftRepository.create({
        userId,
        metadata,
        txId: mintResult.transactionId,
        contractAddress: mintResult.contractAddress,
        tokenId: mintResult.tokenId,
        stellarAssetCode: mintResult.assetCode,
        stellarAssetIssuer: mintResult.assetIssuer,
        collectionId,
        mintPrice,
        transferLogs: [
          {
            from: "mint",
            to: recipientStellarAddress,
            timestamp: new Date(),
            transactionId: mintResult.transactionId,
          },
        ],
      })

      const savedNft = await this.nftRepository.save(nft)

      // Update collection total supply
      if (collection) {
        collection.totalSupply += 1
        await this.collectionRepository.save(collection)
      }

      // Emit event
      this.eventEmitter.emit("nft.minted", new NftMintedEvent(savedNft))

      this.logger.log(`NFT minted successfully with ID: ${savedNft.id}`)
      return savedNft
    } catch (error) {
      this.logger.error(`Failed to mint NFT: ${error.message}`, error.stack)
      throw error
    }
  }

  async transferNft(options: TransferNftOptions): Promise<Nft> {
    const { nftId, fromUserId, toUserId, toStellarAddress } = options

    try {
      this.logger.log(`Transferring NFT ${nftId} from user ${fromUserId} to user ${toUserId}`)

      // Find the NFT
      const nft = await this.nftRepository.findOne({
        where: { id: nftId, userId: fromUserId, currentOwner: true },
      })

      if (!nft) {
        throw new NotFoundException(`NFT not found or not owned by user ${fromUserId}`)
      }

      // Perform transfer on Stellar (simplified - would need sender's private key in real implementation)
      const transferTxId = await this.stellarNftService.transferNft(
        "sender_public_key", // Would need to get this from user's Stellar account
        toStellarAddress,
        nft.stellarAssetCode!,
        nft.stellarAssetIssuer!,
      )

      // Update NFT ownership
      nft.userId = toUserId
      nft.transferLogs.push({
        from: fromUserId,
        to: toUserId,
        timestamp: new Date(),
        transactionId: transferTxId,
      })

      const updatedNft = await this.nftRepository.save(nft)

      // Emit event
      this.eventEmitter.emit("nft.transferred", new NftTransferredEvent(updatedNft, fromUserId, toUserId))

      this.logger.log(`NFT transferred successfully`)
      return updatedNft
    } catch (error) {
      this.logger.error(`Failed to transfer NFT: ${error.message}`, error.stack)
      throw error
    }
  }

  async findNftsByUser(userId: string): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { userId, currentOwner: true },
      order: { createdAt: "DESC" },
    })
  }

  async findNftById(id: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({ where: { id } })
    if (!nft) {
      throw new NotFoundException(`NFT with ID ${id} not found`)
    }
    return nft
  }

  async findNftByTxId(txId: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({ where: { txId } })
    if (!nft) {
      throw new NotFoundException(`NFT with transaction ID ${txId} not found`)
    }
    return nft
  }

  async updateNftMetadata(id: string, updateData: UpdateNftDto): Promise<Nft> {
    const nft = await this.findNftById(id)

    if (updateData.metadata) {
      this.validateMetadata(updateData.metadata)
      nft.metadata = { ...nft.metadata, ...updateData.metadata }
    }

    if (updateData.rarityScore !== undefined) {
      nft.rarityScore = updateData.rarityScore
    }

    return this.nftRepository.save(nft)
  }

  async calculateRarityScore(nftId: string): Promise<number> {
    const nft = await this.findNftById(nftId)

    if (!nft.metadata.attributes || nft.metadata.attributes.length === 0) {
      return 0
    }

    // Simple rarity calculation based on attribute frequency
    // In a real implementation, this would be more sophisticated
    let rarityScore = 0
    const totalNfts = await this.nftRepository.count()

    for (const attribute of nft.metadata.attributes) {
      const attributeCount = await this.nftRepository
        .createQueryBuilder("nft")
        .where("nft.metadata->'attributes' @> :attribute", {
          attribute: JSON.stringify([{ trait_type: attribute.trait_type, value: attribute.value }]),
        })
        .getCount()

      const rarity = totalNfts / Math.max(attributeCount, 1)
      rarityScore += rarity
    }

    // Update the NFT with calculated rarity score
    nft.rarityScore = Math.round(rarityScore * 100) / 100
    await this.nftRepository.save(nft)

    return nft.rarityScore
  }

  async verifyNftOwnership(nftId: string, userId: string): Promise<boolean> {
    const nft = await this.nftRepository.findOne({
      where: { id: nftId, userId, currentOwner: true },
    })
    return !!nft
  }

  private validateMetadata(metadata: NftMetadata): void {
    if (!metadata.name || !metadata.description || !metadata.image) {
      throw new BadRequestException("NFT metadata must include name, description, and image")
    }

    if (metadata.name.length > 100) {
      throw new BadRequestException("NFT name must be 100 characters or less")
    }

    if (metadata.description.length > 1000) {
      throw new BadRequestException("NFT description must be 1000 characters or less")
    }

    // Validate image URL format
    try {
      new URL(metadata.image)
    } catch {
      throw new BadRequestException("NFT image must be a valid URL")
    }

    // Validate attributes if present
    if (metadata.attributes) {
      for (const attribute of metadata.attributes) {
        if (!attribute.trait_type || attribute.value === undefined) {
          throw new BadRequestException("Each attribute must have trait_type and value")
        }
      }
    }
  }
}
