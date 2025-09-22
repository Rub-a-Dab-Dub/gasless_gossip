import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlurredAvatar } from './blurred-avatar.entity';

@Injectable()
export class BlurredAvatarsService {
  constructor(
    @InjectRepository(BlurredAvatar)
    private readonly blurredAvatarRepo: Repository<BlurredAvatar>,
  ) {}

  // Create a blurred avatar entry
  async create(userId: string, blurLevel: number, imageUrl: string): Promise<BlurredAvatar> {
    const newAvatar = this.blurredAvatarRepo.create({ userId, blurLevel, imageUrl });
    return await this.blurredAvatarRepo.save(newAvatar);
  }

  // Get all blurred avatars by userId
  async findByUserId(userId: string): Promise<BlurredAvatar[]> {
    return await this.blurredAvatarRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  // Get a single avatar by ID
  async findById(id: string): Promise<BlurredAvatar | null> {
    return await this.blurredAvatarRepo.findOne({ where: { id } });
  }

  // Delete a blurred avatar
  async remove(id: string): Promise<void> {
    await this.blurredAvatarRepo.delete(id);
  }

  // Update blur level or image
  async update(id: string, blurLevel?: number, imageUrl?: string): Promise<BlurredAvatar> {
    const avatar = await this.findById(id);
    if (!avatar) throw new Error('Avatar not found');

    if (blurLevel !== undefined) avatar.blurLevel = blurLevel;
    if (imageUrl !== undefined) avatar.imageUrl = imageUrl;

    return await this.blurredAvatarRepo.save(avatar);
  }
}
