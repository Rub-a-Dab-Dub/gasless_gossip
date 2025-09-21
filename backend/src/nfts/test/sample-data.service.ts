import { Injectable, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { NftsService } from "../services/nfts.service"
import type { Nft, NftMetadata } from "../entities/nft.entity"
import type { NftCollection } from "../entities/nft-collection.entity"

@Injectable()
export class SampleDataService {
  private readonly logger = new Logger(SampleDataService.name)

  constructor(
    private nftsService: NftsService,
    private nftRepository: Repository<Nft>,
    private collectionRepository: Repository<NftCollection>,
  ) {}

  async generateSampleNfts(count = 10): Promise<Nft[]> {
    this.logger.log(`Generating ${count} sample NFTs`)

    const sampleNfts: Nft[] = []
    const sampleUserId = "123e4567-e89b-12d3-a456-426614174000"

    for (let i = 1; i <= count; i++) {
      const metadata: NftMetadata = {
        name: `Whisper Collectible #${i.toString().padStart(3, "0")}`,
        description: `A unique collectible from the Whisper universe. This is item #${i} in the collection.`,
        image: `https://example.com/nft-images/whisper-${i}.png`,
        attributes: [
          {
            trait_type: "Rarity",
            value: this.getRandomRarity(),
          },
          {
            trait_type: "Background",
            value: this.getRandomBackground(),
          },
          {
            trait_type: "Eyes",
            value: this.getRandomEyes(),
          },
          {
            trait_type: "Accessory",
            value: this.getRandomAccessory(),
          },
          {
            trait_type: "Generation",
            value: 1,
          },
        ],
        external_url: `https://whisper.com/collectibles/${i}`,
      }

      try {
        const nft = await this.nftsService.mintNft({
          userId: sampleUserId,
          metadata,
          recipientStellarAddress: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
          mintPrice: this.getRandomPrice(),
        })

        sampleNfts.push(nft)
        this.logger.log(`Generated sample NFT ${i}/${count}: ${nft.id}`)

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        this.logger.error(`Failed to generate sample NFT ${i}: ${error.message}`)
      }
    }

    this.logger.log(`Successfully generated ${sampleNfts.length} sample NFTs`)
    return sampleNfts
  }

  async createSampleCollection(): Promise<NftCollection> {
    const collection = this.collectionRepository.create({
      name: "Whisper Genesis Collection",
      symbol: "WGC",
      description: "The first collection of Whisper collectibles, featuring unique characters and rare items.",
      metadata: {
        name: "Whisper Genesis Collection",
        description: "The first collection of Whisper collectibles, featuring unique characters and rare items.",
        image: "https://example.com/collections/whisper-genesis.png",
        banner_image: "https://example.com/collections/whisper-genesis-banner.png",
        external_link: "https://whisper.com/collections/genesis",
        seller_fee_basis_points: 250, // 2.5%
        fee_recipient: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
      },
      contractAddress: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
      creatorAddress: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
      maxSupply: 10000,
      isVerified: true,
    })

    return this.collectionRepository.save(collection)
  }

  async testNftOperations(): Promise<void> {
    this.logger.log("Starting NFT operations test")

    try {
      // Create sample collection
      const collection = await this.createSampleCollection()
      this.logger.log(`Created sample collection: ${collection.id}`)

      // Generate sample NFTs
      const nfts = await this.generateSampleNfts(5)
      this.logger.log(`Generated ${nfts.length} sample NFTs`)

      // Test NFT retrieval
      const userNfts = await this.nftsService.findNftsByUser("123e4567-e89b-12d3-a456-426614174000")
      this.logger.log(`Retrieved ${userNfts.length} NFTs for user`)

      // Test rarity calculation
      for (const nft of nfts) {
        const rarityScore = await this.nftsService.calculateRarityScore(nft.id)
        this.logger.log(`NFT ${nft.id} rarity score: ${rarityScore}`)
      }

      // Test ownership verification
      const isOwner = await this.nftsService.verifyNftOwnership(nfts[0].id, "123e4567-e89b-12d3-a456-426614174000")
      this.logger.log(`Ownership verification result: ${isOwner}`)

      this.logger.log("NFT operations test completed successfully")
    } catch (error) {
      this.logger.error(`NFT operations test failed: ${error.message}`, error.stack)
      throw error
    }
  }

  private getRandomRarity(): string {
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
    const weights = [50, 30, 15, 4, 1] // Weighted probabilities

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < rarities.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return rarities[i]
      }
    }

    return rarities[0]
  }

  private getRandomBackground(): string {
    const backgrounds = ["Blue", "Red", "Green", "Purple", "Gold", "Silver", "Black", "White"]
    return backgrounds[Math.floor(Math.random() * backgrounds.length)]
  }

  private getRandomEyes(): string {
    const eyes = ["Brown", "Blue", "Green", "Hazel", "Gray", "Amber", "Violet"]
    return eyes[Math.floor(Math.random() * eyes.length)]
  }

  private getRandomAccessory(): string {
    const accessories = ["None", "Hat", "Glasses", "Earrings", "Necklace", "Crown", "Mask"]
    return accessories[Math.floor(Math.random() * accessories.length)]
  }

  private getRandomPrice(): string {
    const prices = ["1.0000000", "2.5000000", "5.0000000", "10.0000000", "25.0000000", "50.0000000"]
    return prices[Math.floor(Math.random() * prices.length)]
  }
}
