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
var NftsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsService = void 0;
const common_1 = require("@nestjs/common");
const nft_minted_event_1 = require("../events/nft-minted.event");
const nft_transferred_event_1 = require("../events/nft-transferred.event");
let NftsService = NftsService_1 = class NftsService {
    nftRepository;
    collectionRepository;
    stellarNftService;
    eventEmitter;
    logger = new common_1.Logger(NftsService_1.name);
    constructor(nftRepository, collectionRepository, stellarNftService, eventEmitter) {
        this.nftRepository = nftRepository;
        this.collectionRepository = collectionRepository;
        this.stellarNftService = stellarNftService;
        this.eventEmitter = eventEmitter;
    }
    async mintNft(options) {
        const { userId, metadata, recipientStellarAddress, collectionId, mintPrice } = options;
        try {
            this.logger.log(`Minting NFT for user ${userId}`);
            this.validateMetadata(metadata);
            let collection = null;
            if (collectionId) {
                collection = await this.collectionRepository.findOne({ where: { id: collectionId } });
                if (!collection) {
                    throw new common_1.NotFoundException(`Collection with ID ${collectionId} not found`);
                }
            }
            const mintResult = await this.stellarNftService.mintNft(recipientStellarAddress, metadata, collection?.symbol || "WHISPER");
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
            });
            const savedNft = await this.nftRepository.save(nft);
            if (collection) {
                collection.totalSupply += 1;
                await this.collectionRepository.save(collection);
            }
            this.eventEmitter.emit("nft.minted", new nft_minted_event_1.NftMintedEvent(savedNft));
            this.logger.log(`NFT minted successfully with ID: ${savedNft.id}`);
            return savedNft;
        }
        catch (error) {
            this.logger.error(`Failed to mint NFT: ${error.message}`, error.stack);
            throw error;
        }
    }
    async transferNft(options) {
        const { nftId, fromUserId, toUserId, toStellarAddress } = options;
        try {
            this.logger.log(`Transferring NFT ${nftId} from user ${fromUserId} to user ${toUserId}`);
            const nft = await this.nftRepository.findOne({
                where: { id: nftId, userId: fromUserId, currentOwner: true },
            });
            if (!nft) {
                throw new common_1.NotFoundException(`NFT not found or not owned by user ${fromUserId}`);
            }
            const transferTxId = await this.stellarNftService.transferNft("sender_public_key", toStellarAddress, nft.stellarAssetCode, nft.stellarAssetIssuer);
            nft.userId = toUserId;
            nft.transferLogs.push({
                from: fromUserId,
                to: toUserId,
                timestamp: new Date(),
                transactionId: transferTxId,
            });
            const updatedNft = await this.nftRepository.save(nft);
            this.eventEmitter.emit("nft.transferred", new nft_transferred_event_1.NftTransferredEvent(updatedNft, fromUserId, toUserId));
            this.logger.log(`NFT transferred successfully`);
            return updatedNft;
        }
        catch (error) {
            this.logger.error(`Failed to transfer NFT: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findNftsByUser(userId) {
        return this.nftRepository.find({
            where: { userId, currentOwner: true },
            order: { createdAt: "DESC" },
        });
    }
    async findNftById(id) {
        const nft = await this.nftRepository.findOne({ where: { id } });
        if (!nft) {
            throw new common_1.NotFoundException(`NFT with ID ${id} not found`);
        }
        return nft;
    }
    async findNftByTxId(txId) {
        const nft = await this.nftRepository.findOne({ where: { txId } });
        if (!nft) {
            throw new common_1.NotFoundException(`NFT with transaction ID ${txId} not found`);
        }
        return nft;
    }
    async updateNftMetadata(id, updateData) {
        const nft = await this.findNftById(id);
        if (updateData.metadata) {
            this.validateMetadata(updateData.metadata);
            nft.metadata = { ...nft.metadata, ...updateData.metadata };
        }
        if (updateData.rarityScore !== undefined) {
            nft.rarityScore = updateData.rarityScore;
        }
        return this.nftRepository.save(nft);
    }
    async calculateRarityScore(nftId) {
        const nft = await this.findNftById(nftId);
        if (!nft.metadata.attributes || nft.metadata.attributes.length === 0) {
            return 0;
        }
        let rarityScore = 0;
        const totalNfts = await this.nftRepository.count();
        for (const attribute of nft.metadata.attributes) {
            const attributeCount = await this.nftRepository
                .createQueryBuilder("nft")
                .where("nft.metadata->'attributes' @> :attribute", {
                attribute: JSON.stringify([{ trait_type: attribute.trait_type, value: attribute.value }]),
            })
                .getCount();
            const rarity = totalNfts / Math.max(attributeCount, 1);
            rarityScore += rarity;
        }
        nft.rarityScore = Math.round(rarityScore * 100) / 100;
        await this.nftRepository.save(nft);
        return nft.rarityScore;
    }
    async verifyNftOwnership(nftId, userId) {
        const nft = await this.nftRepository.findOne({
            where: { id: nftId, userId, currentOwner: true },
        });
        return !!nft;
    }
    validateMetadata(metadata) {
        if (!metadata.name || !metadata.description || !metadata.image) {
            throw new common_1.BadRequestException("NFT metadata must include name, description, and image");
        }
        if (metadata.name.length > 100) {
            throw new common_1.BadRequestException("NFT name must be 100 characters or less");
        }
        if (metadata.description.length > 1000) {
            throw new common_1.BadRequestException("NFT description must be 1000 characters or less");
        }
        try {
            new URL(metadata.image);
        }
        catch {
            throw new common_1.BadRequestException("NFT image must be a valid URL");
        }
        if (metadata.attributes) {
            for (const attribute of metadata.attributes) {
                if (!attribute.trait_type || attribute.value === undefined) {
                    throw new common_1.BadRequestException("Each attribute must have trait_type and value");
                }
            }
        }
    }
};
exports.NftsService = NftsService;
exports.NftsService = NftsService = NftsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function, Object])
], NftsService);
//# sourceMappingURL=nfts.service.js.map