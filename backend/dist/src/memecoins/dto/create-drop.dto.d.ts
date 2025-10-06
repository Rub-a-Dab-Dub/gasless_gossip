export declare class CreateDropDto {
    recipients: string[];
    amount: number;
    assetCode?: string;
    dropType?: 'reward' | 'airdrop' | 'bonus';
}
