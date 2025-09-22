import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomThemesService } from '../room-themes.service';
import { RoomTheme } from '../entities/room-theme.entity';
import { StellarService } from '../../stellar/stellar.service';

describe('RoomThemesService', () => {
  let service: RoomThemesService;
  let repository: Repository<RoomTheme>;
  let stellarService: StellarService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockStellarService = {
    verifyPremiumThemeOwnership: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomThemesService,
        {
          provide: getRepositoryToken(RoomTheme),
          useValue: mockRepository,
        },
        {
          provide: StellarService,
          useValue: mockStellarService,
        },
      ],
    }).compile();

    service = module.get<RoomThemesService>(RoomThemesService);
    repository = module.get<Repository<RoomTheme>>(getRepositoryToken(RoomTheme));
    stellarService = module.get<StellarService>(StellarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should apply a new theme to a room', async () => {
    const createDto = { roomId: 'room-1', themeId: 'candlelit', metadata: { color: 'warm' } };
    const userId = 'user-1';
    const savedTheme = {
      id: '1',
      roomId: 'room-1',
      themeId: 'candlelit',
      metadata: { color: 'warm' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockStellarService.verifyPremiumThemeOwnership.mockResolvedValue(true);
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.create.mockReturnValue(savedTheme);
    mockRepository.save.mockResolvedValue(savedTheme);

    const result = await service.applyTheme(createDto, userId);

    expect(result.roomId).toBe('room-1');
    expect(result.themeId).toBe('candlelit');
    expect(mockStellarService.verifyPremiumThemeOwnership).toHaveBeenCalledWith(userId, 'candlelit');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should update existing theme for a room', async () => {
    const createDto = { roomId: 'room-1', themeId: 'neon', metadata: { brightness: 'high' } };
    const userId = 'user-1';
    const existingTheme = {
      id: '1',
      roomId: 'room-1',
      themeId: 'candlelit',
      metadata: { color: 'warm' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedTheme = { ...existingTheme, themeId: 'neon', metadata: { brightness: 'high' } };

    mockStellarService.verifyPremiumThemeOwnership.mockResolvedValue(true);
    mockRepository.findOne.mockResolvedValue(existingTheme);
    mockRepository.save.mockResolvedValue(updatedTheme);

    const result = await service.applyTheme(createDto, userId);

    expect(result.themeId).toBe('neon');
    expect(mockRepository.save).toHaveBeenCalledWith(updatedTheme);
  });

  it('should throw ForbiddenException for premium theme without ownership', async () => {
    const createDto = { roomId: 'room-1', themeId: 'premium-gold' };
    const userId = 'user-1';

    mockStellarService.verifyPremiumThemeOwnership.mockResolvedValue(false);

    await expect(service.applyTheme(createDto, userId)).rejects.toThrow('User does not own the required premium theme token');
  });

  it('should get room theme', async () => {
    const roomTheme = {
      id: '1',
      roomId: 'room-1',
      themeId: 'candlelit',
      metadata: { color: 'warm' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository.findOne.mockResolvedValue(roomTheme);

    const result = await service.getRoomTheme('room-1');

    expect(result?.themeId).toBe('candlelit');
  });

  it('should return null if room has no theme', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const result = await service.getRoomTheme('room-1');

    expect(result).toBeNull();
  });
});