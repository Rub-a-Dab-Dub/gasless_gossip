import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { GenerateCodeDto } from './dto/generate-code.dto';
import { ReferralResponseDto } from './dto/referral-response.dto';

@ApiTags('referrals')
@Controller('referrals')
// @UseGuards(JwtAuthGuard) // Uncomment when you have auth guards
@ApiBearerAuth()
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new referral' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Referral created successfully',
    type: ReferralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid referral data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already referred or invalid referral code',
  })
  async createReferral(@Body() createReferralDto: CreateReferralDto) {
    return await this.referralsService.createReferral(createReferralDto);
  }

  @Post('generate-code')
  @ApiOperation({ summary: 'Generate a referral code for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Referral code generated successfully',
  })
  async generateReferralCode(@Body() generateCodeDto: GenerateCodeDto) {
    const referralCode = await this.referralsService.generateReferralCode(
      generateCodeDto.userId
    );
    return { referralCode };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get referral history for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Referral history retrieved successfully',
    type: [ReferralResponseDto],
  })
  async getReferralHistory(
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    return await this.referralsService.findReferralsByUser(userId);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get referral statistics for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Referral stats retrieved successfully',
  })
  async getReferralStats(
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    return await this.referralsService.getReferralStats(userId);
  }
}

// src/referrals/referrals.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';
import { StellarService } from './services/stellar.service';
import { Referral } from './entities/referral.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Referral]),
    ConfigModule,
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService, StellarService],
  exports: [ReferralsService, StellarService],
})
export class ReferralsModule {}

// src/referrals/__tests__/referrals.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReferralsService } from '../referrals.service';
import { StellarService } from '../services/stellar.service';
import { Referral } from '../entities/referral.entity';

describe('ReferralsService', () => {
  let service: ReferralsService;
  let repository: Repository<Referral>;
  let stellarService: StellarService;

  const mockReferral = {
    id: 'test-id',
    referrerId: 'referrer-id',
    refereeId: 'referee-id',
    referralCode: 'TESTCODE',
    reward: 10,
    status: 'pending',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralsService,
        {
          provide: getRepositoryToken(Referral),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: StellarService,
          useValue: {
            distributeReward: jest.fn(),
            validateStellarAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReferralsService>(ReferralsService);
    repository = module.get<Repository<Referral>>(getRepositoryToken(Referral));
    stellarService = module.get<StellarService>(StellarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReferral', () => {
    it('should create a referral successfully', async () => {
      const createReferralDto = {
        referralCode: 'TESTCODE',
        refereeId: 'referee-id',
      };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockReferral) // Find referral code
        .mockResolvedValueOnce(null); // Check if referee already exists

      jest.spyOn(repository, 'create').mockReturnValue(mockReferral as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockReferral as any);

      const result = await service.createReferral(createReferralDto);

      expect(result).toEqual(mockReferral);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid referral code', async () => {
      const createReferralDto = {
        referralCode: 'INVALID',
        refereeId: 'referee-id',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.createReferral(createReferralDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if user already referred', async () => {
      const createReferralDto = {
        referralCode: 'TESTCODE',
        refereeId: 'referee-id',
      };

      jest.spyOn(repository, 'findOne')
        .mockResolvedValueOnce(mockReferral) // Find referral code
        .mockResolvedValueOnce(mockReferral); // Referee already exists

      await expect(service.createReferral(createReferralDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('generateReferralCode', () => {
    it('should generate a unique referral code', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const code = await service.generateReferralCode('user-id');

      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBe(8);
    });
  });

  describe('findReferralsByUser', () => {
    it('should return referrals for a user', async () => {
      const mockReferrals = [mockReferral];
      jest.spyOn(repository, 'find').mockResolvedValue(mockReferrals as any);

      const result = await service.findReferralsByUser('user-id');

      expect(result).toEqual(mockReferrals);
    });
  });
});

// src/referrals/__tests__/referrals.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReferralsController } from '../referrals.controller';
import { ReferralsService } from '../referrals.service';

describe('ReferralsController', () => {
  let controller: ReferralsController;
  let service: ReferralsService;

  const mockReferral = {
    id: 'test-id',
    referrerId: 'referrer-id',
    refereeId: 'referee-id',
    referralCode: 'TESTCODE',
    reward: 10,
    status: 'pending',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferralsController],
      providers: [
        {
          provide: ReferralsService,
          useValue: {
            createReferral: jest.fn(),
            generateReferralCode: jest.fn(),
            findReferralsByUser: jest.fn(),
            getReferralStats: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReferralsController>(ReferralsController);
    service = module.get<ReferralsService>(ReferralsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createReferral', () => {
    it('should create a referral', async () => {
      const createReferralDto = {
        referralCode: 'TESTCODE',
        refereeId: 'referee-id',
      };

      jest.spyOn(service, 'createReferral').mockResolvedValue(mockReferral as any);

      const result = await controller.createReferral(createReferralDto);

      expect(result).toEqual(mockReferral);
      expect(service.createReferral).toHaveBeenCalledWith(createReferralDto);
    });
  });

  describe('generateReferralCode', () => {
    it('should generate a referral code', async () => {
      const generateCodeDto = { userId: 'user-id' };
      const expectedCode = 'ABCD1234';

      jest.spyOn(service, 'generateReferralCode').mockResolvedValue(expectedCode);

      const result = await controller.generateReferralCode(generateCodeDto);

      expect(result).toEqual({ referralCode: expectedCode });
    });
  });

  describe('getReferralHistory', () => {
    it('should return referral history', async () => {
      const mockReferrals = [mockReferral];
      jest.spyOn(service, 'findReferralsByUser').mockResolvedValue(mockReferrals as any);

      const result = await controller.getReferralHistory('user-id');

      expect(result).toEqual(mockReferrals);
    });
  });
});