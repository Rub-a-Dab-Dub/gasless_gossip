import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class DocumentStorageService {
  private s3Bucket = process.env.KYC_S3_BUCKET || 'kyc-documents';
  private ipfsGateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

  async upload(file: Express.Multer.File, userId: string): Promise<{ url: string; hash: string }> {
    // Hash the document for integrity
    const hash = this.hashDocument(file.buffer);

    // Simulate S3 upload (replace with actual AWS SDK logic)
    const fileName = `${userId}/${Date.now()}-${file.originalname}`;
    const url = await this.uploadToS3(fileName, file.buffer, file.mimetype);

    // Optional: Also pin to IPFS for decentralized storage
    // const ipfsHash = await this.pinToIPFS(file.buffer);

    return { url, hash };
  }

  async getSecureUrl(documentUrl: string, expiresIn: number = 3600): Promise<string> {
    // Generate presigned URL for S3 (replace with actual AWS SDK logic)
    // For now, return the URL with a signed token
    const token = this.generateSignedToken(documentUrl, expiresIn);
    return `${documentUrl}?token=${token}&expires=${Date.now() + expiresIn * 1000}`;
  }

  async verifyDocumentIntegrity(documentUrl: string, expectedHash: string): Promise<boolean> {
    // Download document and verify hash
    // const buffer = await this.downloadFromS3(documentUrl);
    // const actualHash = this.hashDocument(buffer);
    // return actualHash === expectedHash;
    
    // Simulated for now
    return true;
  }

  private hashDocument(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private async uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<string> {
    // Simulate S3 upload
    // In production, use AWS SDK:
    // const s3 = new S3Client({ region: 'us-east-1' });
    // await s3.send(new PutObjectCommand({
    //   Bucket: this.s3Bucket,
    //   Key: key,
    //   Body: buffer,
    //   ContentType: contentType,
    // }));

    return `https://${this.s3Bucket}.s3.amazonaws.com/${key}`;
  }

  private async pinToIPFS(buffer: Buffer): Promise<string> {
    // Simulate IPFS pinning
    // In production, use IPFS client:
    // const ipfs = create({ url: 'https://ipfs.infura.io:5001' });
    // const { cid } = await ipfs.add(buffer);
    // return cid.toString();

    const mockCid = crypto.randomBytes(32).toString('hex');
    return mockCid;
  }

  private generateSignedToken(url: string, expiresIn: number): string {
    const secret = process.env.DOC_SIGNING_SECRET || 'secret-key';
    const payload = `${url}:${Date.now() + expiresIn * 1000}`;
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
}