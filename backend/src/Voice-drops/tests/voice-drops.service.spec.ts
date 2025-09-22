import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoiceDropsService } from '../services/voice-drops.service';
import { VoiceDrop } from '../entities/voice-drop.entity';
import { IpfsService } from '../services/ipfs.service';
import { StellarService } from '../services/stellar.service';

describe('VoiceDropsService', () => {
  let service: VoiceDropsService;
  let repository: Repository<VoiceDrop>;
  let ipfsService: IpfsService;
  let stellarService: StellarService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockIpfsService = {
    uploadAudioFile: jest.fn(),
    getAudioUrl: jest.fn(),
  };

  const mockStellarService = {
    createStellarHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceDropsService,
        {
          provide: getRepositoryToken(VoiceDrop),
          useValue: mockRepository,
        },
        {
          provide: IpfsService,
          useValue: mockIpfsService,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
      ],
    }).compile();

    service = module.get<VoiceDropsService>(VoiceDropsService);
    repository = module.get<Repository<VoiceDrop>>(getRepositoryToken(VoiceDrop));
    ipfsService = module.get<IpfsService>(IpfsService);
    stellarService = module.get<StellarService>(StellarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVoiceDrop', () => {
    it('should create and save a voice drop', async () => {
      const createDto = {
        roomId: 'room-uuid',
        duration: 60,
        fileSize: 1024,
        fileName: 'test.mp3',
        mimeType: 'audio/mpeg',
      };

      const audioFile = {
        originalname: 'test.mp3',
        mimetype: 'audio/mpeg',
        size: 1024,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const ipfsResult = {
        hash: 'ipfs-hash',
        url: 'https://ipfs.io/ipfs/ipfs-hash',
        size: 1024,
      };

      const stellarResult = {
        hash: 'stellar-hash',
        transactionId: 'tx-123',
      };

      const savedVoiceDrop = {
        id: 'voice-drop-uuid',
        roomId: createDto.roomId,
        audioHash: ipfsResult.hash,
        stellarHash: stellarResult.hash,
        creatorId: 'user-id',
        fileName: createDto.fileName,
        duration: createDto.duration,
        fileSize: createDto.fileSize,
        mimeType: createDto.mimeType,
        createdAt: new Date(),
      };

      mockIpfsService.uploadAudioFile.mockResolvedValue(ipfsResult);
      mockStellarService.createStellarHash.mockResolvedValue(stellarResult);
      mockRepository.create.mockReturnValue(savedVoiceDrop);
      mockRepository.save.mockResolvedValue(savedVoiceDrop);
      mockIpfsService.getAudioUrl.mockReturnValue(ipfsResult.url);

      const result = await service.createVoiceDrop(createDto, audioFile, 'user-id');

      expect(result.id).toBe('voice-drop-uuid');
      expect(result.audioUrl).toBe(ipfsResult.url);
      expect(mockIpfsService.uploadAudioFile).toHaveBeenCalledWith(audioFile);
      expect(mockStellarService.createStellarHash).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
