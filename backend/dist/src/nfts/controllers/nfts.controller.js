"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nft_response_dto_1 = require("../dto/nft-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let NftsController = class NftsController {
    nftsService;
    constructor(nftsService) {
        this.nftsService = nftsService;
    }
    async mintNft(user, createNftDto) {
        const nft = await this.nftsService.mintNft({
            userId: user.id,
            metadata: createNftDto.metadata,
            recipientStellarAddress: createNftDto.recipientStellarAddress || user.stellarAccountId,
            collectionId: createNftDto.collectionId,
            mintPrice: createNftDto.mintPrice,
        });
        return new nft_response_dto_1.NftResponseDto(nft);
    }
    async getNftsByUser(userId, collectionId, limit = 20, offset = 0) {
        const nfts = await this.nftsService.findNftsByUser(userId);
        let filteredNfts = nfts;
        if (collectionId) {
            filteredNfts = nfts.filter((nft) => nft.collectionId === collectionId);
        }
        const paginatedNfts = filteredNfts.slice(offset, offset + limit);
        return paginatedNfts.map((nft) => new nft_response_dto_1.NftResponseDto(nft));
    }
    async getNftById(id) {
        const nft = await this.nftsService.findNftById(id);
        return new nft_response_dto_1.NftResponseDto(nft);
    }
    async getNftByTxId(txId) {
        const nft = await this.nftsService.findNftByTxId(txId);
        return new nft_response_dto_1.NftResponseDto(nft);
    }
    async transferNft(user, transferNftDto) {
        const nft = await this.nftsService.transferNft({
            nftId: transferNftDto.nftId,
            fromUserId: user.id,
            toUserId: transferNftDto.toUserId,
            toStellarAddress: transferNftDto.toStellarAddress,
        });
        return new nft_response_dto_1.NftResponseDto(nft);
    }
    async calculateRarity(id) {
        const rarityScore = await this.nftsService.calculateRarityScore(id);
        return { nftId: id, rarityScore };
    }
    async verifyOwnership(nftId, userId) {
        const isOwner = await this.nftsService.verifyNftOwnership(nftId, userId);
        return { nftId, userId, isOwner };
    }
    async getNftsByCollection(collectionId, limit = 20, offset = 0) {
        return [];
    }
};
exports.NftsController = NftsController;
__decorate([
    (0, common_1.Post)("mint"),
    (0, swagger_1.ApiOperation)({ summary: "Mint a new NFT" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "NFT minted successfully",
        type: nft_response_dto_1.NftResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Invalid metadata or minting parameters",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        description: "Failed to mint NFT on Stellar network",
    }),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "mintNft", null);
__decorate([
    (0, common_1.Get)(":userId"),
    (0, swagger_1.ApiOperation)({ summary: "Get NFTs owned by a user" }),
    (0, swagger_1.ApiParam)({
        name: "userId",
        description: "User ID to get NFTs for",
        type: "string",
        format: "uuid",
    }),
    (0, swagger_1.ApiQuery)({
        name: "collectionId",
        description: "Filter by collection ID",
        required: false,
        type: "string",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Maximum number of NFTs to return",
        required: false,
        type: "number",
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: "offset",
        description: "Number of NFTs to skip",
        required: false,
        type: "number",
        example: 0,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "List of NFTs owned by the user",
        type: [nft_response_dto_1.NftResponseDto],
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('collectionId')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getNftsByUser", null);
__decorate([
    (0, common_1.Get)('details/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NFT details by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'NFT ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'NFT details',
        type: nft_response_dto_1.NftResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'NFT not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getNftById", null);
__decorate([
    (0, common_1.Get)('transaction/:txId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NFT by transaction ID' }),
    (0, swagger_1.ApiParam)({
        name: 'txId',
        description: 'Stellar transaction ID',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'NFT details',
        type: nft_response_dto_1.NftResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'NFT not found',
    }),
    __param(0, (0, common_1.Param)('txId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getNftByTxId", null);
__decorate([
    (0, common_1.Post)("transfer"),
    (0, swagger_1.ApiOperation)({ summary: "Transfer NFT to another user" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "NFT transferred successfully",
        type: nft_response_dto_1.NftResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: "NFT not found or not owned by user",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Invalid transfer parameters",
    }),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "transferNft", null);
__decorate([
    (0, common_1.Post)(':id/calculate-rarity'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate rarity score for an NFT' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'NFT ID',
        type: 'string',
        format: 'uuid',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Rarity score calculated',
        schema: {
            type: 'object',
            properties: {
                nftId: { type: 'string' },
                rarityScore: { type: 'number' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "calculateRarity", null);
__decorate([
    (0, common_1.Get)(":id/verify-ownership/:userId"),
    (0, swagger_1.ApiOperation)({ summary: "Verify NFT ownership" }),
    (0, swagger_1.ApiParam)({
        name: "id",
        description: "NFT ID",
        type: "string",
        format: "uuid",
    }),
    (0, swagger_1.ApiParam)({
        name: "userId",
        description: "User ID to verify ownership for",
        type: "string",
        format: "uuid",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Ownership verification result",
        schema: {
            type: "object",
            properties: {
                nftId: { type: "string" },
                userId: { type: "string" },
                isOwner: { type: "boolean" },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "verifyOwnership", null);
__decorate([
    (0, common_1.Get)("collections/:collectionId/nfts"),
    (0, swagger_1.ApiOperation)({ summary: "Get NFTs from a specific collection" }),
    (0, swagger_1.ApiParam)({
        name: "collectionId",
        description: "Collection ID",
        type: "string",
        format: "uuid",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        description: "Maximum number of NFTs to return",
        required: false,
        type: "number",
        example: 20,
    }),
    (0, swagger_1.ApiQuery)({
        name: "offset",
        description: "Number of NFTs to skip",
        required: false,
        type: "number",
        example: 0,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "List of NFTs from the collection",
        type: [nft_response_dto_1.NftResponseDto],
    }),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getNftsByCollection", null);
exports.NftsController = NftsController = __decorate([
    (0, swagger_1.ApiTags)("NFTs"),
    (0, common_1.Controller)("nfts"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [Function])
], NftsController);
//# sourceMappingURL=nfts.controller.js.map