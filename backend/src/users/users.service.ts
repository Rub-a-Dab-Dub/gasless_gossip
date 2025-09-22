import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keypair } from 'stellar-sdk';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing username or email
    const existingUser = await this.userRepository.findOne({
      where!: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Validate Stellar account if provided
    if (createUserDto.stellarAccountId) {
      this.validateStellarAccount(createUserDto.stellarAccountId);
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where!: { isActive: true },
      select: ['id', 'username', 'pseudonym', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where!: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check for username/email conflicts
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where!: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username or email already exists');
      }
    }

    // Validate Stellar account if provided
    if (updateUserDto.stellarAccountId) {
      this.validateStellarAccount(updateUserDto.stellarAccountId);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async linkStellarAccount(
    userId!: string,
    stellarAccountId: string,
  ): Promise<User> {
    this.validateStellarAccount(stellarAccountId);

    // Check if Stellar account is already linked
    const existingLink = await this.userRepository.findOne({
      where!: { stellarAccountId },
    });

    if (existingLink && existingLink.id !== userId) {
      throw new ConflictException(
        'Stellar account already linked to another user',
      );
    }

    const user = await this.findOne(userId);
    user.stellarAccountId = stellarAccountId;
    return this.userRepository.save(user);
  }

  private validateStellarAccount(stellarAccountId: string): void {
    try {
      Keypair.fromPublicKey(stellarAccountId);
    } catch (error) {
      throw new BadRequestException('Invalid Stellar account ID format');
    }
  }
}
