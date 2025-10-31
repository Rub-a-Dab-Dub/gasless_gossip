import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Post } from '../posts/entities/post.entity';
import { ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async totalUserCount(): Promise<number> {
    return await this.usersRepository.count();
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async searchByUsername(username: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: { username: ILike(`%${username}%`) },
      select: ['id', 'username', 'photo', 'title'],
    });

    if (!users.length) {
      throw new NotFoundException('User not found');
    }
    return users;
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (updateData.id || updateData.xp) {
      throw new UnprocessableEntityException('Unacceptable payload');
    }
    if (updateData.username && updateData.username !== user.username) {
      const existing_username = await this.usersRepository.findOne({
        where: { username: updateData.username },
      });
      if (existing_username) {
        throw new UnprocessableEntityException('Username not available');
      }
    }
    if (updateData.email && updateData.email !== user.email) {
      const existing_email = await this.usersRepository.findOne({
        where: { email: updateData.email },
      });
      if (existing_email) {
        throw new UnprocessableEntityException('Email address in use');
      }
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
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

  async profileStats(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'following', 'posts'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      posts: user.posts?.length || 0,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
    };
  }

  async followUser(followerId: number, followedId: number) {
    if (followerId === followedId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    const followed = await this.usersRepository.findOne({
      where: { id: followedId },
    });

    if (!follower || !followed) {
      throw new NotFoundException('User not found');
    }

    const alreadyFollowing = follower.following.some(
      (user) => user.id === followedId,
    );

    if (alreadyFollowing) {
      throw new BadRequestException('Already following this user');
    }

    follower.following.push(followed);
    await this.usersRepository.save(follower);

    return { message: `You are now following ${followed.username}` };
  }

  async unfollowUser(followerId: number, followedId: number) {
    const follower = await this.usersRepository.findOne({
      where: { id: followerId },
      relations: ['following'],
    });

    if (!follower) throw new NotFoundException('User not found');

    follower.following = follower.following.filter(
      (user) => user.id !== followedId,
    );

    await this.usersRepository.save(follower);
    return { message: 'Unfollowed successfully' };
  }

  async getFollowers(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      users: user.followers.map((f) => ({
        id: f.id,
        username: f.username,
        photo: f.photo,
      })),
    };
  }

  async getFollowing(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      users: user.following.map((f) => ({
        id: f.id,
        username: f.username,
        photo: f.photo,
      })),
    };
  }
}