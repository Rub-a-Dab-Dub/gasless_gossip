import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { CreateReferralDto } from './dto/create-referral.dto';
import { StellarService } from './services/stellar.service';
import * as crypto from 'crypto';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    private stellarService: StellarService,
  ) {}

  async generateReferralCode(userId: string): Promise<string> {
    // Generate a unique referral code
    let referralCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      referralCode = this.createReferralCode(userId);
      const existing = await this.referralRepository.findOne({
        where: { referralCode }
      });
      isUnique = !existing;
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Could not generate unique referral code');
    }

    return referralCode;
  }

  private createReferralCode(userId: string): string {
    const hash = crypto.createHash('sha256').update(userId + Date.now()).digest('hex');
    return hash.substring(0, 8).toUpperCase();
  }

  async createReferral(createReferralDto: CreateReferralDto): Promise<Referral> {
    const { referralCode, refereeId } = createReferralDto;

    // Find the referrer by referral code
    const existingReferral = await this.referralRepository.findOne({
      where: { referralCode }
    });

    if (!existingReferral) {
      throw new NotFoundException('Invalid referral code');
    }

    // Check if referee has already been referred
    const existingReferee = await this.referralRepository.findOne({
      where: { refereeId }
    });

    if (existingReferee) {
      throw new ConflictException('User has already been referred');
    }

    // Check if user is trying to refer themselves
    if (existingReferral.referrerId === refereeId) {
      throw new BadRequestException('Users cannot refer themselves');
    }

    // Create new referral record
    const referral = this.referralRepository.create({
      referrerId: existingReferral.referrerId,
      refereeId,
      referralCode,
      reward: 10, // Base reward amount
      status: 'pending'
    });

    const savedReferral = await this.referralRepository.save(referral);

    // Process reward asynchronously
    this.processReward(savedReferral.id).catch(error => {
      console.error('Failed to process referral reward:', error);
    });

    return savedReferral;
  }

  private async processReward(referralId: string): Promise<void> {
    const referral = await this.referralRepository.findOne({
      where: { id: referralId }
    });

    if (!referral) return;

    try {
      // In a real app, you'd get the user's Stellar public key from user profile
      // For now, we'll simulate this
      const userStellarPublicKey = await this.getUserStellarPublicKey(referral.referrerId);
      
      if (!userStellarPublicKey) {
        throw new Error('User does not have a Stellar account configured');
      }

      const result = await this.stellarService.distributeReward(
        userStellarPublicKey,
        referral.reward
      );

      if (result.success) {
        await this.referralRepository.update(referral.id, {
          status: 'completed',
          stellarTransactionId: result.transactionId,
          completedAt: new Date()
        });
      } else {
        await this.referralRepository.update(referral.id, {
          status: 'failed'
        });
      }
    } catch (error) {
      await this.referralRepository.update(referral.id, {
        status: 'failed'
      });
    }
  }

  private async getUserStellarPublicKey(userId: string): Promise<string | null> {
    // TODO: Implement actual user lookup
    // This would typically query your users table to get their Stellar public key
    // For demo purposes, return a test public key
    return process.env.STELLAR_TEST_PUBLIC_KEY || null;
  }

  async findReferralsByUser(userId: string): Promise<Referral[]> {
    return this.referralRepository.find({
      where: [
        { referrerId: userId },
        { refereeId: userId }
      ],
      order: { createdAt: 'DESC' }
    });
  }

  async getReferralStats(userId: string) {
    const referrals = await this.referralRepository.find({
      where: { referrerId: userId }
    });

    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(r => r.status === 'completed').length;
    const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
    const totalRewards = referrals
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + Number(r.reward), 0);

    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalRewards,
      referrals
    };
  }
}