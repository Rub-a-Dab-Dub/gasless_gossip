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
var SampleDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleDataService = void 0;
const common_1 = require("@nestjs/common");
let SampleDataService = SampleDataService_1 = class SampleDataService {
    nftsService;
    nftRepository;
    collectionRepository;
    logger = new common_1.Logger(SampleDataService_1.name);
    constructor(nftsService, nftRepository, collectionRepository) {
        this.nftsService = nftsService;
        this.nftRepository = nftRepository;
        this.collectionRepository = collectionRepository;
    }
    async generateSampleNfts(count = 10) {
        this.logger.log(`Generating ${count} sample NFTs`);
        const sampleNfts = [];
        const sampleUserId = "123e4567-e89b-12d3-a456-426614174000";
        for (let i = 1; i <= count; i++) {
            const metadata = {
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
            };
            try {
                const nft = await this.nftsService.mintNft({
                    userId: sampleUserId,
                    metadata,
                    recipientStellarAddress: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
                    mintPrice: this.getRandomPrice(),
                });
                sampleNfts.push(nft);
                this.logger.log(`Generated sample NFT ${i}/${count}: ${nft.id}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            catch (error) {
                this.logger.error(`Failed to generate sample NFT ${i}: ${error.message}`);
            }
        }
        this.logger.log(`Successfully generated ${sampleNfts.length} sample NFTs`);
        return sampleNfts;
    }
    async createSampleCollection() {
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
                seller_fee_basis_points: 250,
                fee_recipient: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
            },
            contractAddress: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
            creatorAddress: "GCLWGQPMKXQSPF776IU33AH4PZNOOWNAWGGKVTBQMIC5IMKUNP3E6NVU",
            maxSupply: 10000,
            isVerified: true,
        });
        return this.collectionRepository.save(collection);
    }
    async testNftOperations() {
        this.logger.log("Starting NFT operations test");
        try {
            const collection = await this.createSampleCollection();
            this.logger.log(`Created sample collection: ${collection.id}`);
            const nfts = await this.generateSampleNfts(5);
            this.logger.log(`Generated ${nfts.length} sample NFTs`);
            const userNfts = await this.nftsService.findNftsByUser("123e4567-e89b-12d3-a456-426614174000");
            this.logger.log(`Retrieved ${userNfts.length} NFTs for user`);
            for (const nft of nfts) {
                const rarityScore = await this.nftsService.calculateRarityScore(nft.id);
                this.logger.log(`NFT ${nft.id} rarity score: ${rarityScore}`);
            }
            const isOwner = await this.nftsService.verifyNftOwnership(nfts[0].id, "123e4567-e89b-12d3-a456-426614174000");
            this.logger.log(`Ownership verification result: ${isOwner}`);
            this.logger.log("NFT operations test completed successfully");
        }
        catch (error) {
            this.logger.error(`NFT operations test failed: ${error.message}`, error.stack);
            throw error;
        }
    }
    getRandomRarity() {
        const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
        const weights = [50, 30, 15, 4, 1];
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < rarities.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return rarities[i];
            }
        }
        return rarities[0];
    }
    getRandomBackground() {
        const backgrounds = ["Blue", "Red", "Green", "Purple", "Gold", "Silver", "Black", "White"];
        return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    }
    getRandomEyes() {
        const eyes = ["Brown", "Blue", "Green", "Hazel", "Gray", "Amber", "Violet"];
        return eyes[Math.floor(Math.random() * eyes.length)];
    }
    getRandomAccessory() {
        const accessories = ["None", "Hat", "Glasses", "Earrings", "Necklace", "Crown", "Mask"];
        return accessories[Math.floor(Math.random() * accessories.length)];
    }
    getRandomPrice() {
        const prices = ["1.0000000", "2.5000000", "5.0000000", "10.0000000", "25.0000000", "50.0000000"];
        return prices[Math.floor(Math.random() * prices.length)];
    }
};
exports.SampleDataService = SampleDataService;
exports.SampleDataService = SampleDataService = SampleDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function])
], SampleDataService);
//# sourceMappingURL=sample-data.service.js.map