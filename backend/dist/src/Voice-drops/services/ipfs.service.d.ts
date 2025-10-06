import { ConfigService } from '@nestjs/config';
import { IpfsUploadResult } from '../interfaces/ipfs.interface';
export declare class IpfsService {
    private configService;
    private readonly logger;
    private readonly ipfsGateway;
    private readonly ipfsApiUrl;
    constructor(configService: ConfigService);
    uploadAudioFile(file: Express.Multer.File): Promise<IpfsUploadResult>;
    private uploadToLocalIpfs;
    getAudioUrl(hash: string): string;
}
