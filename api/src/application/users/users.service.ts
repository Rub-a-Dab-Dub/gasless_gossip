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
import { UserVerificationService } from './user-verification.service';
import { Wallet } from '../wallets/entities/wallet.entity';
import { UserProfileDto, PublicUserDto } from './dtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private readonly chatService: ChatsService,
    private readonly userVerificationService: UserVerificationService,
  ) {}

  async totalUserCount(): Promise<number> {
    return await this.usersRepository.count();
  }

  // Helper method to remove sensitive fields
  private sanitizeUser(user: User): Partial<User> {
    const { password, is_verified, email, ...safeUser } = user;
    return safeUser;
  }

  // Helper method to get public user info
  private getPublicUserInfo(user: User): PublicUserDto {
    return {
      id: user.id,
      username: user.username,
      photo: user.photo,
      title: user.title,
      about: user.about,
      xp: user.xp,
    };
  }

  async findById(id: number): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['followers', 'following', 'posts'],
    });
    if (!user) throw new NotFoundException('User not found');

    const wallet = await this.walletRepository.findOne({
      where: { user: { id } },
    });

    const stats = {
      posts: user.posts?.length || 0,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
    };

    return {
      id: user.id,
      username: user.username,
      photo: user.photo,
      email: user.email,
      is_verified: user.is_verified,
      address: user.address,
      xp: user.xp,
      title: user.title,
      about: user.about,
      created_at: user.created_at,
      stats,
      wallet: wallet
        ? {
            celo_address: wallet.celo_address,
            celo_balance: wallet.celo_balance?.toString() || '0',
            base_address: wallet.base_address,
            base_balance: wallet.base_balance?.toString() || '0',
            starknet_address: wallet.starknet_address,
            starknet_balance: wallet.starknet_balance?.toString() || '0',
          }
        : undefined,
    };
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

  async updateProfile(
    id: number,
    updateData: Partial<User>,
  ): Promise<UserProfileDto> {
    const userEntity = await this.usersRepository.findOne({ where: { id } });
    if (!userEntity) throw new NotFoundException('User not found');

    if (
      updateData.id ||
      updateData.xp ||
      updateData.is_verified ||
      updateData.password
    ) {
      throw new UnprocessableEntityException('Unacceptable payload');
    }
    if (updateData.username && updateData.username !== userEntity.username) {
      const existing_username = await this.usersRepository.findOne({
        where: { username: updateData.username },
      });
      if (existing_username) {
        throw new UnprocessableEntityException('Username not available');
      }
    }
    if (updateData.email && updateData.email !== userEntity.email) {
      const existing_email = await this.usersRepository.findOne({
        where: { email: updateData.email },
      });
      if (existing_email) {
        throw new UnprocessableEntityException('Email address in use');
      }
    }

    Object.assign(userEntity, updateData);
    await this.usersRepository.save(userEntity);

    // Return sanitized profile
    return this.findById(id);
  }

  async changePassword(id: number, old_password: string, new_password: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const passwordValid = await bcrypt.compare(old_password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    if (old_password === new_password) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    if (new_password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
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
      title: f.title,
      xp: f.xp,
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
      title: f.title,
      xp: f.xp,
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
      .select([
        'user.id',
        'user.username',
        'user.photo',
        'user.title',
        'user.xp',
      ])
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

    const wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

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
        xp: user.xp,
        created_at: user.created_at,
      },
      chat,
      stats: profileStats,
      isFollowing,
      isFollowedBy,
      wallet: wallet
        ? {
            celo_address: wallet.celo_address,
            base_address: wallet.base_address,
            starknet_address: wallet.starknet_address,
          }
        : undefined,
      posts,
    };
  }

  async removeExpiredTokens(): Promise<void> {
    const deletedCount =
      await this.userVerificationService.cleanupExpiredTokens();
    console.log(`Cleaned up ${deletedCount} expired verification tokens`);
  }
}
