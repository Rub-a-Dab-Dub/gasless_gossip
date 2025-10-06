export declare class BlockchainVerifyService {
    private contractAddress;
    private rpcUrl;
    verify(userId: string, documents: Array<{
        hash: string;
        type: string;
    }>): Promise<{
        proof: string;
        txHash: string;
    }>;
    verifyProofOnChain(userId: string, proof: string): Promise<boolean>;
    getVerificationStatus(userId: string): Promise<{
        isVerified: boolean;
        timestamp: number;
        blockNumber: number;
    }>;
    private generateMerkleProof;
    private submitToChain;
}
