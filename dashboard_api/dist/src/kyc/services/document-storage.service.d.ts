export declare class DocumentStorageService {
    private s3Bucket;
    private ipfsGateway;
    upload(file: Express.Multer.File, userId: string): Promise<{
        url: string;
        hash: string;
    }>;
    getSecureUrl(documentUrl: string, expiresIn?: number): Promise<string>;
    verifyDocumentIntegrity(documentUrl: string, expectedHash: string): Promise<boolean>;
    private hashDocument;
    private uploadToS3;
    private pinToIPFS;
    private generateSignedToken;
}
