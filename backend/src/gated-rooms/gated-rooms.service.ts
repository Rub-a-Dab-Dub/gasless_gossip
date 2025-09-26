import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GatedRoom, GateRule } from './entities/gated-room.entity';
import { CreateGatedRoomDto } from './dto/create-gated-room.dto';
import { CheckAccessDto, AccessStatusDto } from './dto/check-access.dto';
import * as StellarSdk from 'stellar-sdk';

@Injectable()
export class GatedRoomsService {
  private readonly logger = new Logger(GatedRoomsService.name);
  private server: StellarSdk.Horizon.Server;

  constructor(
    @InjectRepository(GatedRoom)
    private gatedRoomRepository: Repository<GatedRoom>,
  ) {
    // Initialize Stellar server (use testnet for development)
    this.server = new StellarSdk.Horizon.Server(
      'https://horizon-testnet.stellar.org',
    );
  }

  async createGatedRoom(
    createGatedRoomDto: CreateGatedRoomDto,
  ): Promise<GatedRoom> {
    const gatedRoom = this.gatedRoomRepository.create(createGatedRoomDto);
    return await this.gatedRoomRepository.save(gatedRoom);
  }

  async findAll(): Promise<GatedRoom[]> {
    return await this.gatedRoomRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GatedRoom> {
    const gatedRoom = await this.gatedRoomRepository.findOne({
      where: { id, isActive: true },
    });

    if (!gatedRoom) {
      throw new NotFoundException(`Gated room with ID ${id} not found`);
    }

    return gatedRoom;
  }

  async findByRoomId(roomId: string): Promise<GatedRoom | null> {
    return await this.gatedRoomRepository.findOne({
      where: { roomId, isActive: true },
    });
  }

  async checkAccess(checkAccessDto: CheckAccessDto): Promise<AccessStatusDto> {
    const { roomId, stellarAccountId } = checkAccessDto;

    // Find gated room by roomId
    const gatedRoom = await this.findByRoomId(roomId);

    if (!gatedRoom) {
      return {
        hasAccess: true, // If room is not gated, allow access
        roomId,
        stellarAccountId,
        gateRules: [],
        verificationResults: [],
      };
    }

    // Verify each gate rule
    const verificationResults = await Promise.all(
      gatedRoom.gateRules.map((rule) =>
        this.verifyGateRule(stellarAccountId, rule),
      ),
    );

    // Check if all rules pass (AND logic)
    const hasAccess = verificationResults.every((result) => result.passed);

    return {
      hasAccess,
      roomId,
      stellarAccountId,
      gateRules: gatedRoom.gateRules,
      verificationResults,
    };
  }

  private async verifyGateRule(
    stellarAccountId: string,
    rule: GateRule,
  ): Promise<any> {
    try {
      this.logger.log(
        `Verifying gate rule for account ${stellarAccountId}: ${JSON.stringify(rule)}`,
      );

      // Load account from Stellar network
      const account = await this.server.loadAccount(stellarAccountId);

      if (rule.type === 'token') {
        return await this.verifyTokenHolding(account, rule);
      } else if (rule.type === 'nft') {
        return await this.verifyNftHolding(account, rule);
      }

      return {
        passed: false,
        rule,
        error: 'Unknown rule type',
      };
    } catch (error) {
      this.logger.error(`Error verifying gate rule: ${error.message}`);
      return {
        passed: false,
        rule,
        error: error.message,
      };
    }
  }

  private async verifyTokenHolding(
    account: StellarSdk.Horizon.AccountResponse,
    rule: GateRule,
  ): Promise<any> {
    const balance = account.balances.find(
      (b) =>
        b.asset_type !== 'native' &&
        b.asset_code === rule.assetCode &&
        b.asset_issuer === rule.issuer,
    );

    if (!balance) {
      return {
        passed: false,
        rule,
        error: 'Token not found in account',
        actualBalance: 0,
      };
    }

    const actualBalance = parseFloat(balance.balance);
    const requiredAmount = rule.minAmount || 1;
    const passed = actualBalance >= requiredAmount;

    return {
      passed,
      rule,
      actualBalance,
      requiredAmount,
      error: passed
        ? null
        : `Insufficient balance. Required: ${requiredAmount}, Actual: ${actualBalance}`,
    };
  }

  private async verifyNftHolding(
    account: StellarSdk.Horizon.AccountResponse,
    rule: GateRule,
  ): Promise<any> {
    // For NFTs on Stellar, we check if the account has the specific asset
    // NFTs are typically represented as assets with supply of 1
    const nftBalance = account.balances.find(
      (b) =>
        b.asset_type !== 'native' &&
        b.asset_code === rule.assetCode &&
        b.asset_issuer === rule.issuer,
    );

    if (!nftBalance) {
      return {
        passed: false,
        rule,
        error: 'NFT not found in account',
      };
    }

    // For NFTs, we typically just check if the balance > 0
    const hasNft = parseFloat(nftBalance.balance) > 0;

    return {
      passed: hasNft,
      rule,
      balance: nftBalance.balance,
      error: hasNft ? null : 'NFT not owned by account',
    };
  }

  async deleteGatedRoom(id: string): Promise<void> {
    const gatedRoom = await this.findOne(id);
    gatedRoom.isActive = false;
    await this.gatedRoomRepository.save(gatedRoom);
  }
}
