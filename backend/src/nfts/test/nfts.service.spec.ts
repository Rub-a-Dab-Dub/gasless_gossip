import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { NftsService } from "../services/nfts.service"
import { StellarNftService } from "../services/stellar-nft.service"
import { Nft } from "../entities/nft.entity"
import { NftCollection } from "../entities/nft-collection.entity"
import { NotFoundException, BadRequestException } from "@nestjs/common"
import { jest } from "@jest/globals" // Import jest to declare it

describe("NftsService", () => {
  let service: NftsService
  let nftRepository: Repository<Nft>
  let collectionRepository: Repository<NftCollection>
  let stellarNftService: StellarNftService
  let eventEmitter: EventEmitter2

  const mockNft = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    userId: "987fcdeb-51a2-43d1-9f12-345678901234",
    metadata: {
      name: "Test NFT",
      description: "A test NFT",
      image: "https://example.com/image.png",
    },
    txId: "test-tx-id",
    contractAddress: "test-contract",
    tokenId: "test-token",
    stellarAssetCode: "TESTNFT001",
    stellarAssetIssuer: "test-issuer",
    transferLogs: [],
    currentOwner: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockMintResult = {
    transactionId: "test-tx-id",
    assetCode: "TESTNFT001",
    assetIssuer: "test-issuer",
    contractAddress: "test-contract",
    tokenId: "test-token",
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftsService,
        {
          provide: getRepositoryToken(Nft),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(NftCollection),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: StellarNftService,
          useValue: {
            mintNft: jest.fn(),
            transferNft: jest.fn(),
            verifyNftOwnership: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<NftsService>(NftsService)
    nftRepository = module.get<Repository<Nft>>(getRepositoryToken(Nft))
    collectionRepository = module.get<Repository<NftCollection>>(getRepositoryToken(NftCollection))
    stellarNftService = module.get<StellarNftService>(StellarNftService)
    eventEmitter = module.get<EventEmitter2>(EventEmitter2)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("mintNft", () => {
    it("should mint an NFT successfully", async () => {
      const mintOptions = {
        userId: "987fcdeb-51a2-43d1-9f12-345678901234",
        metadata: {
          name: "Test NFT",
          description: "A test NFT",
          image: "https://example.com/image.png",
        },
        recipientStellarAddress: "test-stellar-address",
      }

      jest.spyOn(stellarNftService, "mintNft").mockResolvedValue(mockMintResult)
      jest.spyOn(nftRepository, "create").mockReturnValue(mockNft as any)
      jest.spyOn(nftRepository, "save").mockResolvedValue(mockNft as any)

      const result = await service.mintNft(mintOptions)

      expect(stellarNftService.mintNft).toHaveBeenCalledWith(
        mintOptions.recipientStellarAddress,
        mintOptions.metadata,
        "WHISPER",
      )
      expect(nftRepository.create).toHaveBeenCalled()
      expect(nftRepository.save).toHaveBeenCalled()
      expect(eventEmitter.emit).toHaveBeenCalledWith("nft.minted", expect.any(Object))
      expect(result).toEqual(mockNft)
    })

    it("should throw BadRequestException for invalid metadata", async () => {
      const mintOptions = {
        userId: "987fcdeb-51a2-43d1-9f12-345678901234",
        metadata: {
          name: "",
          description: "A test NFT",
          image: "invalid-url",
        },
        recipientStellarAddress: "test-stellar-address",
      }

      await expect(service.mintNft(mintOptions)).rejects.toThrow(BadRequestException)
    })
  })

  describe("findNftsByUser", () => {
    it("should return NFTs for a user", async () => {
      const userId = "987fcdeb-51a2-43d1-9f12-345678901234"
      const mockNfts = [mockNft]

      jest.spyOn(nftRepository, "find").mockResolvedValue(mockNfts as any)

      const result = await service.findNftsByUser(userId)

      expect(nftRepository.find).toHaveBeenCalledWith({
        where: { userId, currentOwner: true },
        order: { createdAt: "DESC" },
      })
      expect(result).toEqual(mockNfts)
    })
  })

  describe("findNftById", () => {
    it("should return an NFT by ID", async () => {
      const nftId = "123e4567-e89b-12d3-a456-426614174000"

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(mockNft as any)

      const result = await service.findNftById(nftId)

      expect(nftRepository.findOne).toHaveBeenCalledWith({ where: { id: nftId } })
      expect(result).toEqual(mockNft)
    })

    it("should throw NotFoundException when NFT not found", async () => {
      const nftId = "non-existent-id"

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(null)

      await expect(service.findNftById(nftId)).rejects.toThrow(NotFoundException)
    })
  })

  describe("transferNft", () => {
    it("should transfer an NFT successfully", async () => {
      const transferOptions = {
        nftId: "123e4567-e89b-12d3-a456-426614174000",
        fromUserId: "987fcdeb-51a2-43d1-9f12-345678901234",
        toUserId: "456e7890-e12b-34d5-a678-901234567890",
        toStellarAddress: "recipient-stellar-address",
      }

      const updatedNft = { ...mockNft, userId: transferOptions.toUserId }

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(mockNft as any)
      jest.spyOn(stellarNftService, "transferNft").mockResolvedValue("transfer-tx-id")
      jest.spyOn(nftRepository, "save").mockResolvedValue(updatedNft as any)

      const result = await service.transferNft(transferOptions)

      expect(nftRepository.findOne).toHaveBeenCalledWith({
        where: { id: transferOptions.nftId, userId: transferOptions.fromUserId, currentOwner: true },
      })
      expect(stellarNftService.transferNft).toHaveBeenCalled()
      expect(eventEmitter.emit).toHaveBeenCalledWith("nft.transferred", expect.any(Object))
      expect(result.userId).toBe(transferOptions.toUserId)
    })

    it("should throw NotFoundException when NFT not found or not owned", async () => {
      const transferOptions = {
        nftId: "non-existent-id",
        fromUserId: "987fcdeb-51a2-43d1-9f12-345678901234",
        toUserId: "456e7890-e12b-34d5-a678-901234567890",
        toStellarAddress: "recipient-stellar-address",
      }

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(null)

      await expect(service.transferNft(transferOptions)).rejects.toThrow(NotFoundException)
    })
  })

  describe("calculateRarityScore", () => {
    it("should calculate rarity score for an NFT", async () => {
      const nftId = "123e4567-e89b-12d3-a456-426614174000"
      const nftWithAttributes = {
        ...mockNft,
        metadata: {
          ...mockNft.metadata,
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Eyes", value: "Green" },
          ],
        },
      }

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(nftWithAttributes as any)
      jest.spyOn(nftRepository, "count").mockResolvedValue(1000)

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(10),
      }
      jest.spyOn(nftRepository, "createQueryBuilder").mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(nftRepository, "save").mockResolvedValue(nftWithAttributes as any)

      const result = await service.calculateRarityScore(nftId)

      expect(result).toBeGreaterThan(0)
      expect(nftRepository.save).toHaveBeenCalled()
    })

    it("should return 0 for NFT without attributes", async () => {
      const nftId = "123e4567-e89b-12d3-a456-426614174000"

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(mockNft as any)
      jest.spyOn(nftRepository, "save").mockResolvedValue(mockNft as any)

      const result = await service.calculateRarityScore(nftId)

      expect(result).toBe(0)
    })
  })

  describe("verifyNftOwnership", () => {
    it("should verify NFT ownership", async () => {
      const nftId = "123e4567-e89b-12d3-a456-426614174000"
      const userId = "987fcdeb-51a2-43d1-9f12-345678901234"

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(mockNft as any)

      const result = await service.verifyNftOwnership(nftId, userId)

      expect(nftRepository.findOne).toHaveBeenCalledWith({
        where: { id: nftId, userId, currentOwner: true },
      })
      expect(result).toBe(true)
    })

    it("should return false for non-owned NFT", async () => {
      const nftId = "123e4567-e89b-12d3-a456-426614174000"
      const userId = "different-user-id"

      jest.spyOn(nftRepository, "findOne").mockResolvedValue(null)

      const result = await service.verifyNftOwnership(nftId, userId)

      expect(result).toBe(false)
    })
  })
})
