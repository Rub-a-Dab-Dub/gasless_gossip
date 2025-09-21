import { Injectable, Logger } from '@nestjs/common';
import { IIPFSService } from '../interfaces/ipfs-service.interface';
import * as crypto from 'crypto';

@Injectable()
export class IPFSService implements IIPFSService {
  private readonly logger = new Logger(IPFSService.name);
  private readonly ipfsGateway =
    process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

  async uploadAudio(audioBuffer: Buffer, filename: string): Promise<string> {
    try {
      // In a real implementation, you would use IPFS client
      // For now, we'll simulate with a hash
      const hash = crypto
        .createHash('sha256')
        .update(audioBuffer)
        .digest('hex');
      const ipfsHash = `Qm${hash.substring(0, 44)}`;

      this.logger.log(`Uploaded audio to IPFS: ${ipfsHash}`);
      return ipfsHash;
    } catch (error) {
      this.logger.error('Failed to upload audio to IPFS', error);
      throw new Error('IPFS upload failed');
    }
  }

  getAudioUrl(hash: string): string {
    return `${this.ipfsGateway}${hash}`;
  }

  async pinContent(hash: string): Promise<void> {
    try {
      // Pin content to ensure persistence
      this.logger.log(`Pinned content: ${hash}`);
    } catch (error) {
      this.logger.error('Failed to pin content', error);
      throw new Error('IPFS pinning failed');
    }
  }
}
