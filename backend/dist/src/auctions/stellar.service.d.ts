export declare class StellarService {
    private server;
    private networkPassphrase;
    constructor();
    createEscrowAccount(): Promise<string>;
    processEscrowPayment(bidderId: string, escrowAccount: string, amount: number): Promise<string>;
    refundBidder(escrowAccount: string, bidderId: string, amount: number, originalTxId: string): Promise<void>;
    transferToGiftOwner(escrowAccount: string, giftId: string, amount: number): Promise<void>;
    transferGiftToWinner(giftId: string, winnerId: string): Promise<void>;
}
