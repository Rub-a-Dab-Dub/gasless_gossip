import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async changePassword(id: number, old_password: string, new_password: string) {
    const user = await this.findById(id);
    const passwordValid = await bcrypt.compare(old_password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    user.password = await bcrypt.hash(new_password, 10);
    await this.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }
}
