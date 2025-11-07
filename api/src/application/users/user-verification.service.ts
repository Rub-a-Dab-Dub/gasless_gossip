import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { UserVerification } from './entities/user-verification.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserVerificationService {
  private readonly MAX_RETRIES = 3;
  private readonly TOKEN_EXPIRY_MINUTES = 5; // Token expires in 5 minutes
  private readonly TOKEN_DELETION_HOURS = 1; // Delete tokens after 1 hour

  constructor(
    @InjectRepository(UserVerification)
    private verificationRepository: Repository<UserVerification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createVerificationToken(
    userId: number,
    type: 'verify-email' | 'forgot-password' = 'verify-email',
  ): Promise<UserVerification> {
    // Count existing tokens for this user within the last hour
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - this.TOKEN_DELETION_HOURS);

    const retryCount = await this.verificationRepository.count({
      where: {
        userId,
        type,
        created_at: MoreThan(lastHour),
      },
    });

    // Check if max retries exceeded
    if (retryCount >= this.MAX_RETRIES) {
      throw new BadRequestException(
        'Maximum retry limit reached. Please try again after 1 hour or contact support.',
      );
    }

    // Create new fresh token
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.TOKEN_EXPIRY_MINUTES);

    const verification = this.verificationRepository.create({
      userId,
      token,
      type,
      expires_at: expiresAt,
      is_used: false,
    });

    return await this.verificationRepository.save(verification);
  }

  async verifyToken(
    userId: number | null,
    token: string,
    type: 'verify-email' | 'forgot-password' = 'verify-email',
  ): Promise<User> {
    const whereClause: any = { token, type, is_used: false };

    // For security, userId should always be provided
    if (userId !== null) {
      whereClause.userId = userId;
    } else {
      throw new BadRequestException('User ID is required for verification');
    }

    const verification = await this.verificationRepository.findOne({
      where: whereClause,
      relations: ['user'],
      order: { created_at: 'DESC' }, // Get the latest token
    });

    if (!verification) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    if (new Date() > verification.expires_at) {
      throw new BadRequestException(
        'Verification token has expired. Please request a new one.',
      );
    }

    // Mark token as used
    verification.is_used = true;
    await this.verificationRepository.save(verification);

    // Update user verification status
    if (type === 'verify-email') {
      verification.user.is_verified = true;
      await this.userRepository.save(verification.user);
    }

    return verification.user;
  }

  async resendVerification(userId: number): Promise<UserVerification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.is_verified) {
      throw new BadRequestException('User is already verified');
    }

    return await this.createVerificationToken(userId, 'verify-email');
  }

  async getRetryCount(
    userId: number,
    type: 'verify-email' | 'forgot-password' = 'verify-email',
  ): Promise<number> {
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - this.TOKEN_DELETION_HOURS);

    return await this.verificationRepository.count({
      where: {
        userId,
        type,
        created_at: MoreThan(lastHour),
      },
    });
  }

  async cleanupExpiredTokens(): Promise<number> {
    // Only delete tokens that are older than 1 hour
    const deletionThreshold = new Date();
    deletionThreshold.setHours(
      deletionThreshold.getHours() - this.TOKEN_DELETION_HOURS,
    );

    const result = await this.verificationRepository.delete({
      created_at: LessThan(deletionThreshold),
    });

    return result.affected || 0;
  }

  private generateToken(): string {
    // Generate a random 6-digit number
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return token;
  }
}
