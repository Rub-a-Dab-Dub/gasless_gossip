import { IIPFSService } from '../interfaces/ipfs-service.interface';
export declare class IPFSService implements IIPFSService {
    private readonly logger;
    private readonly ipfsGateway;
    uploadAudio(audioBuffer: Buffer, filename: string): Promise<string>;
    getAudioUrl(hash: string): string;
    pinContent(hash: string): Promise<void>;
}
