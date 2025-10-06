import type { ConfigService } from "@nestjs/config";
import * as StellarSdk from "stellar-sdk";
import { DegenBadgeType } from "../entities/degen-badge.entity";
interface StellarMintResult {
    transactionId: string;
    assetCode: string;
    assetIssuer: string;
    amount: string;
}
export declare class StellarBadgeService {
    private readonly configService;
    private readonly logger;
    private readonly server;
    private readonly sourceKeypair;
    private readonly networkPassphrase;
    constructor(configService: ConfigService);
    mintBadgeToken(userId: string, badgeType: DegenBadgeType, rewardAmount: number): Promise<StellarMintResult>;
    createBadgeAsset(badgeType: DegenBadgeType): Promise<StellarSdk.Asset>;
    getBadgeBalance(userPublicKey: string, badgeType: DegenBadgeType): Promise<string>;
    private generateAssetCode;
    private getUserStellarAccount;
}
export {};
