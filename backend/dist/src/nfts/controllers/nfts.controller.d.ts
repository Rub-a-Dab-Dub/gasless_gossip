import type { NftsService } from "../services/nfts.service";
import type { CreateNftDto } from "../dto/create-nft.dto";
import type { TransferNftDto } from "../dto/transfer-nft.dto";
import { NftResponseDto } from "../dto/nft-response.dto";
import type { User } from "../../users/entities/user.entity";
export declare class NftsController {
    private readonly nftsService;
    constructor(nftsService: NftsService);
    mintNft(user: User, createNftDto: CreateNftDto): Promise<NftResponseDto>;
    getNftsByUser(userId: string, collectionId?: string, limit?: number, offset?: number): Promise<NftResponseDto[]>;
    getNftById(id: string): Promise<NftResponseDto>;
    getNftByTxId(txId: string): Promise<NftResponseDto>;
    transferNft(user: User, transferNftDto: TransferNftDto): Promise<NftResponseDto>;
    calculateRarity(id: string): Promise<{
        nftId: string;
        rarityScore: number;
    }>;
    verifyOwnership(nftId: string, userId: string): Promise<{
        nftId: string;
        userId: string;
        isOwner: boolean;
    }>;
    getNftsByCollection(collectionId: string, limit?: number, offset?: number): Promise<NftResponseDto[]>;
}
