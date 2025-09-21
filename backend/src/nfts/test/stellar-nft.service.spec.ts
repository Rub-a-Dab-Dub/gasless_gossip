import { Test, type TestingModule } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { StellarNftService } from "../services/stellar-nft.service"
import { InternalServerErrorException } from "@nestjs/common"
import jest from "jest"

// Mock Stellar SDK
jest.mock("stellar-sdk", () => ({
  Server: jest.fn().mockImplementation(() => ({
    loadAccount: jest.fn(),
    submitTransaction: jest.fn(),
    transactions: jest.fn().mockReturnValue({
      transaction: jest.fn().mockReturnValue({
        call: jest.fn(),
      }),
    }),
  })),
  Keypair: {
    fromSecret: jest.fn().mockReturnValue({
      publicKey: jest.fn().mockReturnValue("test-public-key"),
    }),
  },
  TransactionBuilder: jest.fn(),
  Networks: {
    TESTNET: "Test SDF Network ; September 2015",
  },
  Operation: {
    changeTrust: jest.fn(),
    payment: jest.fn(),
    manageData: jest.fn(),
    setOptions: jest.fn(),
  },
  Asset: jest.fn().mockImplementation((code, issuer) => ({
    getCode: () => code,
    getIssuer: () => issuer,
  })),
  Account: jest.fn(),
  BASE_FEE: "100",
}))

describe("StellarNftService", () => {
  let service: StellarNftService
  let configService: ConfigService

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        STELLAR_HORIZON_URL: "https://horizon-testnet.stellar.org",
        STELLAR_NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
        STELLAR_SOURCE_SECRET: "SALADJFKJSLDKFJLSKDJFLSKDJFLSKDJFLSKDJFLSKDJFLSKDJFLSKDJF",
      }
      return config[key] || defaultValue
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StellarNftService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<StellarNftService>(StellarNftService)
    configService = module.get<ConfigService>(ConfigService)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("mintNft", () => {
    it("should mint an NFT successfully", async () => {
      const recipientPublicKey = "test-recipient-key"
      const metadata = {
        name: "Test NFT",
        description: "A test NFT",
        image: "https://example.com/image.png",
      }

      // Mock successful transaction
      const mockTransaction = {
        sign: jest.fn(),
      }
      const mockTransactionBuilder = {
        addOperation: jest.fn().mockReturnThis(),
        setTimeout: jest.fn().mockReturnThis(),
        build: jest.fn().mockReturnValue(mockTransaction),
      }
      const mockServer = {
        loadAccount: jest.fn().mockResolvedValue({}),
        submitTransaction: jest.fn().mockResolvedValue({
          hash: "test-transaction-hash",
        }),
      }

      // Mock the constructor calls
      require("stellar-sdk").TransactionBuilder.mockImplementation(() => mockTransactionBuilder)
      service["server"] = mockServer as any

      const result = await service.mintNft(recipientPublicKey, metadata)

      expect(result).toEqual({
        transactionId: "test-transaction-hash",
        assetCode: expect.any(String),
        assetIssuer: expect.any(String),
        contractAddress: expect.any(String),
        tokenId: expect.any(String),
      })
      expect(mockServer.loadAccount).toHaveBeenCalled()
      expect(mockServer.submitTransaction).toHaveBeenCalled()
    })

    it("should throw InternalServerErrorException on failure", async () => {
      const recipientPublicKey = "test-recipient-key"
      const metadata = {
        name: "Test NFT",
        description: "A test NFT",
        image: "https://example.com/image.png",
      }

      const mockServer = {
        loadAccount: jest.fn().mockRejectedValue(new Error("Network error")),
      }
      service["server"] = mockServer as any

      await expect(service.mintNft(recipientPublicKey, metadata)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe("verifyNftOwnership", () => {
    it("should verify NFT ownership successfully", async () => {
      const publicKey = "test-public-key"
      const assetCode = "TESTNFT001"
      const assetIssuer = "test-issuer"

      const mockAccount = {
        balances: [
          {
            asset_type: "credit_alphanum12",
            asset_code: assetCode,
            asset_issuer: assetIssuer,
            balance: "1.0000000",
          },
        ],
      }

      const mockServer = {
        loadAccount: jest.fn().mockResolvedValue(mockAccount),
      }
      service["server"] = mockServer as any

      const result = await service.verifyNftOwnership(publicKey, assetCode, assetIssuer)

      expect(result).toBe(true)
      expect(mockServer.loadAccount).toHaveBeenCalledWith(publicKey)
    })

    it("should return false when NFT not owned", async () => {
      const publicKey = "test-public-key"
      const assetCode = "TESTNFT001"
      const assetIssuer = "test-issuer"

      const mockAccount = {
        balances: [
          {
            asset_type: "native",
            balance: "100.0000000",
          },
        ],
      }

      const mockServer = {
        loadAccount: jest.fn().mockResolvedValue(mockAccount),
      }
      service["server"] = mockServer as any

      const result = await service.verifyNftOwnership(publicKey, assetCode, assetIssuer)

      expect(result).toBe(false)
    })

    it("should return false on error", async () => {
      const publicKey = "test-public-key"
      const assetCode = "TESTNFT001"
      const assetIssuer = "test-issuer"

      const mockServer = {
        loadAccount: jest.fn().mockRejectedValue(new Error("Account not found")),
      }
      service["server"] = mockServer as any

      const result = await service.verifyNftOwnership(publicKey, assetCode, assetIssuer)

      expect(result).toBe(false)
    })
  })

  describe("generateAssetCode", () => {
    it("should generate a unique asset code", () => {
      const collectionSymbol = "WHISPER"

      // Access private method for testing
      const assetCode1 = service["generateAssetCode"](collectionSymbol)
      const assetCode2 = service["generateAssetCode"](collectionSymbol)

      expect(assetCode1).toMatch(/^WHISPER/)
      expect(assetCode1.length).toBeLessThanOrEqual(12)
      expect(assetCode1).not.toBe(assetCode2)
    })
  })
})
