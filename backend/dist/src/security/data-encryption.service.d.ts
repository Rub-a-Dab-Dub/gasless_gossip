interface EncryptionResult {
    iv: string;
    authTag: string;
    ciphertext: string;
}
export declare class DataEncryptionService {
    private readonly encryptionKey;
    private readonly hmacKey;
    constructor();
    encrypt(plaintext: string, aad?: string): EncryptionResult;
    decrypt(data: EncryptionResult, aad?: string): string;
    computeSearchHash(value: string): string;
}
export {};
