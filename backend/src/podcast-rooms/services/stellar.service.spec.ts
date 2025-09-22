import { Test, TestingModule } from '@nestjs/testing';
import { StellarService } from './stellar.service';

describe('StellarService', () => {
  let service: StellarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers!: [StellarService],
    }).compile();

    service = module.get<StellarService>(StellarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateHash', () => {
    it('should generate a deterministic hash', async () => {
      const data = 'test-data';
      const hash1 = await service.generateHash(data);
      const hash2 = await service.generateHash(data);

      expect(hash1).toEqual(hash2);
      expect(hash1).toContain('stellar_');
    });

    it('should generate different hashes for different data', async () => {
      const hash1 = await service.generateHash('data1');
      const hash2 = await service.generateHash('data2');

      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('verifyHash', () => {
    it('should verify correct hash', async () => {
      const data = 'test-data';
      const hash = await service.generateHash(data);
      const isValid = await service.verifyHash(data, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect hash', async () => {
      const data = 'test-data';
      const wrongHash = 'wrong-hash';
      const isValid = await service.verifyHash(data, wrongHash);

      expect(isValid).toBe(false);
    });
  });

  describe('storeMetadata', () => {
    it('should store metadata and return transaction hash', async () => {
      const metadata = { test: 'data' };
      const txHash = await service.storeMetadata(metadata);

      expect(txHash).toContain('stellar_');
      expect(typeof txHash).toBe('string');
    });
  });
});
