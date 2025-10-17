import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto, SignupDto } from './dtos/auth.dto';
import { StarknetService } from 'src/starknet/starknet.service';
import { shortString } from 'starknet';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private starknetService: StarknetService,
  ) {}

  async signup(body: SignupDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { username: body.username },
    });
    if (existingUser) {
      throw new UnauthorizedException('Username already taken');
    }

    const get_onchain_address = await this.starknetService.read(
      'get_user_onchain_address',
      [body.username],
    );
    if (get_onchain_address.success) {
      throw new UnauthorizedException('Username already taken');
    }

    const username_felt = shortString.encodeShortString(body.username);
    const create_onchain_address = await this.starknetService.write(
      'create_user',
      [username_felt],
    );

    if (!create_onchain_address.success) {
      throw new UnauthorizedException('Please try again');
    }
    return create_onchain_address;

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.usersRepository.create({
      username: body.username,
      password: hashedPassword,
      ...(body.address && { address: body.address }),
      ...(body.email && { email: body.email }),
    });
    await this.usersRepository.save(user);

    return await this.login({
      username: body.username,
      password: body.password,
    });

    // return { message: 'User created successfully' };
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
