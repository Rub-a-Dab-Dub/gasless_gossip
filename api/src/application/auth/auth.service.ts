import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto, SignupDto } from './dtos/auth.dto';
import { shortString } from 'starknet';
import { ContractsService } from '../../contracts/contracts.service';
import { WalletService } from '../wallets/wallet.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private contractsService: ContractsService,
    private walletService: WalletService,
    @InjectQueue('wallet-queue') private walletQueue: Queue,
  ) {}

  async signup(body: SignupDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { username: body.username },
    });
    if (existingUser) {
      throw new UnauthorizedException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.usersRepository.create({
      username: body.username,
      password: hashedPassword,
      ...(body.address && { address: body.address }),
      ...(body.email && { email: body.email }),
    });
    await this.usersRepository.save(user);

    // Trigger background wallet creation
    await this.walletQueue.add(
      'create-wallet',
      { user },
      {
        attempts: 3,
        backoff: 5000,
      },
    );

    // Login immediately
    return await this.login({
      username: body.username,
      password: body.password,
    });
  }

  async login(body: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { username: body.username },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      username: user.username,
      address: user.address,
      sub: user.id,
    };
    const token = await this.jwtService.signAsync(payload);

    return { user, token };
  }
}
