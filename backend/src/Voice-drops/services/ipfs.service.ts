import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import axios from 'axios';
import { IpfsUploadResult } from '../interfaces/ipfs.interface';

@Injectable()
export class IpfsService {
  private readonly logger = new Logger(IpfsService.name);
  private readonly ipfsGateway: string;
  private readonly ipfsApiUrl: string;

  constructor(private configService: ConfigService) {
    this.ipfsGateway = this.configService.get<string>('IPFS_GATEWAY', 'https://ipfs.io/ipfs/');
    this.ipfsApiUrl = this.configService.get<string>('IPFS_API_URL', 'https://api.pinata.cloud');
  }

  async uploadAudioFile(file: Express.Multer.File): Promise<IpfsUploadResult> {
    try {
      // Validate file
      if (!file.mimetype.startsWith('audio/')) {
        throw new BadRequestException('Only audio files are allowed');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new BadRequestException('File size exceeds 10MB limit');
      }

      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const pinataApiKey = this.configService.get<string>('PINATA_API_KEY');
      const pinataSecretKey = this.configService.get<string>('PINATA_SECRET_KEY');

      if (!pinataApiKey || !pinataSecretKey) {
        // Fallback to local IPFS node
        return this.uploadToLocalIpfs(file);
      }

      const response = await axios.post(
        `${this.ipfsApiUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretKey,
          },
        }
      );

      const hash = response.data.IpfsHash;
      
      this.logger.log(`Audio file uploaded to IPFS: ${hash}`);

      return {
        hash,
        url: `${this.ipfsGateway}${hash}`,
        size: file.size,
      };
    } catch (error) {
      this.logger.error('Failed to upload to IPFS:', error);
      throw new BadRequestException('Failed to upload audio to IPFS');
    }
  }

  private async uploadToLocalIpfs(file: Express.Multer.File): Promise<IpfsUploadResult> {
    const localIpfsUrl = this.configService.get<string>('LOCAL_IPFS_URL', 'http://localhost:5001');
    
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(`${localIpfsUrl}/api/v0/add`, formData, {
      headers: formData.getHeaders(),
    });

    const hash = response.data.Hash;

    return {
      hash,
      url: `${this.ipfsGateway}${hash}`,
      size: file.size,
    };
  }

  getAudioUrl(hash: string): string {
    return `${this.ipfsGateway}${hash}`;
  }
}
