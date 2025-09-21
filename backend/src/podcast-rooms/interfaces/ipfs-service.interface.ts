export interface IIPFSService {
  uploadAudio(audioBuffer: Buffer, filename: string): Promise<string>;
  getAudioUrl(hash: string): string;
  pinContent(hash: string): Promise<void>;
}
