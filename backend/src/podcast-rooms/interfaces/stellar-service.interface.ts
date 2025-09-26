export interface IStellarService {
  generateHash(data: string): Promise<string>;
  verifyHash(data: string, hash: string): Promise<boolean>;
  storeMetadata(metadata: any): Promise<string>;
}
