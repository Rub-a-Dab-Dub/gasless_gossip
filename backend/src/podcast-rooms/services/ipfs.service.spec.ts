// src/podcast-rooms/services/ipfs.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { IPFSService } from './ipfs.service';

describe('IPFSService', () => {
  let service: IPFSService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IPFSService],
    }).compile();

    service = module.get<IPFSService>(IPFSService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadAudio', () => {
    it('should upload audio and return IPFS hash', async () => {
      const audioBuffer = Buffer.from('fake audio data');
      const filename = 'test-audio.mp3';

      const hash = await service.uploadAudio(audioBuffer, filename);

      expect(hash).toMatch(/^Qm[a-zA-Z0-9]{44}$/);
    });
  });

  describe('getAudioUrl', () => {
    it('should return correct IPFS URL', () => {
      const hash = 'QmTestHash123';
      const url = service.getAudioUrl(hash);

      expect(url).toBe('https://ipfs.io/ipfs/QmTestHash123');
    });
  });

  describe('pinContent', () => {
    it('should pin content without throwing', async () => {
      const hash = 'QmTestHash123';

      await expect(service.pinContent(hash)).resolves.toBeUndefined();
    });
  });
});
