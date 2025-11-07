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
import { ChatsService } from 'src/application/chats/chats.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private readonly chatService: ChatsService,
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

  async searchByUsername(
    username: string,
    userId: number,
  ): Promise<
    {
      id: number;
      username: string;
      photo: string | null;
      title: string | null;
      chat_id: number | null;
    }[]
  > {
    const searchTerm = `%${username}%`.trim();
    if (!searchTerm || searchTerm === '%%') {
      throw new NotFoundException('Invalid search term');
    }

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoin(
        'chats',
        'chat',
        `
        chat.isGroup = false AND
        (
          (chat.senderId = :userId AND chat.receiverId = user.id) OR
          (chat.senderId = user.id AND chat.receiverId = :userId)
        )
      `,
        { userId },
      )
      .where('user.username ILIKE :searchTerm', { searchTerm })
      .andWhere('user.id != :userId', { userId })
      .select([
        'user.id AS user_id',
        'user.username AS user_username',
        'user.photo AS user_photo',
        'user.title AS user_title',
        'chat.id AS chat_id',
        'chat.createdAt AS chat_createdAt',
      ])
      .orderBy('chat_createdAt', 'DESC')
      .addOrderBy('user_username', 'ASC');

    const rawResults = await qb.getRawMany();

    // if (rawResults.length === 0) {
    //   throw new NotFoundException('User not found');
    // }
    const seen = new Set<number>();
    const results = rawResults
      .filter((row) => {
        if (seen.has(row.user_id)) return false;
        seen.add(row.user_id);
        return true;
      })
      .map((row) => ({
        id: row.user_id,
        username: row.user_username,
        photo: row.user_photo,
        title: row.user_title,
        chat_id: row.chat_id,
      }));

    return results;
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

  async getFollowers(username: string, search?: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['followers'],
    });

    if (!user) throw new NotFoundException('User not found');
    let followers = user.followers.map((f) => ({
      id: f.id,
      username: f.username,
      photo: f.photo,
    }));

    if (search) {
      const searchLower = search.toLowerCase();
      followers = followers.filter((f) =>
        f.username.toLowerCase().includes(searchLower),
      );
    }

    return followers;
  }

  async getFollowing(username: string, search?: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['following'],
    });

    if (!user) throw new NotFoundException('User not found');

    let following = user.following.map((f) => ({
      id: f.id,
      username: f.username,
      photo: f.photo,
    }));

    if (search) {
      const searchLower = search.toLowerCase();
      following = following.filter((f) =>
        f.username.toLowerCase().includes(searchLower),
      );
    }

    return following;
  }

  async allUsers(userId: number, search?: string) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.photo', 'user.title'])
      .where('user.id != :userId', { userId });

    if (search && search.trim() !== '') {
      query.andWhere('user.username ILIKE :search', { search: `%${search}%` });
    }

    const users = await query.orderBy('RANDOM()').getMany();

    return { users };
  }

  async viewUser(username: string, userId: number) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['followers', 'following', 'posts'],
    });

    if (!user) throw new NotFoundException('User not found');

    const profileStats = {
      posts: user.posts?.length || 0,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
    };

    const isFollowing = user.followers.some((f) => f.id === userId);
    const isFollowedBy = user.following.some((f) => f.id === userId);

    const _posts = await this.postsRepository.find({
      where: { author: { id: user.id } },
      relations: ['likes', 'likes.user'],
      order: { id: 'DESC' },
    });

    const posts = _posts.map((post) => ({
      ...post,
      hasLiked: post.likes?.some((like) => like.user?.id === userId) || false,
    }));

    const chat = await this.chatService.hasChatReturnChatId(userId, user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        photo: user.photo,
        title: user.title,
        about: user.about,
      },
      chat,
      stats: profileStats,
      isFollowing,
      isFollowedBy,
      posts,
    };
  }
}
