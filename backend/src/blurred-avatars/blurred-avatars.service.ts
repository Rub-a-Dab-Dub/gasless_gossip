import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlurredAvatar } from './entities/blurred-avatar.entity';
import { CreateBlurredAvatarDto } from './dto/create-blurred-avatar.dto';
import { UpdateBlurredAvatarDto } from './dto/update-blurred-avatar.dto';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlurredAvatarsService {
  private readonly logger = new Logger(BlurredAvatarsService.name);
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(BlurredAvatar)
    private blurredAvatarRepository: Repository<BlurredAvatar>,
    private configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH', './uploads/blurred-avatars');
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async createBlurredAvatar(createBlurredAvatarDto: CreateBlurredAvatarDto): Promise<BlurredAvatar> {
    try {
      // Check if user already has a blurred avatar
      const existingAvatar = await this.blurredAvatarRepository.findOne({
        where: { userId: createBlurredAvatarDto.userId, isActive: true },
      });

      if (existingAvatar) {
        // Update existing avatar instead of creating new one
        return this.updateBlurredAvatar(existingAvatar.id, {
          blurLevel: createBlurredAvatarDto.blurLevel,
          originalImageUrl: createBlurredAvatarDto.originalImageUrl,
        });
      }

      // Process the image
      const blurredImageUrl = await this.processImage(
        createBlurredAvatarDto.originalImageUrl,
        createBlurredAvatarDto.blurLevel || 5,
        createBlurredAvatarDto.userId,
      );

      // Create new blurred avatar record
      const blurredAvatar = this.blurredAvatarRepository.create({
        ...createBlurredAvatarDto,
        imageUrl: blurredImageUrl,
      });

      const savedAvatar = await this.blurredAvatarRepository.save(blurredAvatar);
      this.logger.log(`Created blurred avatar for user ${createBlurredAvatarDto.userId}`);
      
      return savedAvatar;
    } catch (error) {
      this.logger.error(`Failed to create blurred avatar: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create blurred avatar');
    }
  }

  async findAllByUserId(userId: string): Promise<BlurredAvatar[]> {
    return this.blurredAvatarRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findLatestByUserId(userId: string): Promise<BlurredAvatar | null> {
    return this.blurredAvatarRepository.findOne({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateBlurredAvatar(id: string, updateBlurredAvatarDto: UpdateBlurredAvatarDto): Promise<BlurredAvatar> {
    const avatar = await this.blurredAvatarRepository.findOne({ where: { id } });
    
    if (!avatar) {
      throw new NotFoundException(`Blurred avatar with ID ${id} not found`);
    }

    // If blur level is being updated, reprocess the image
    if (updateBlurredAvatarDto.blurLevel && updateBlurredAvatarDto.blurLevel !== avatar.blurLevel) {
      const newBlurredImageUrl = await this.processImage(
        avatar.originalImageUrl,
        updateBlurredAvatarDto.blurLevel,
        avatar.userId,
      );
      updateBlurredAvatarDto = { ...updateBlurredAvatarDto, imageUrl: newBlurredImageUrl };
    }

    Object.assign(avatar, updateBlurredAvatarDto);
    const updatedAvatar = await this.blurredAvatarRepository.save(avatar);
    
    this.logger.log(`Updated blurred avatar ${id}`);
    return updatedAvatar;
  }

  async remove(id: string): Promise<void> {
    const avatar = await this.blurredAvatarRepository.findOne({ where: { id } });
    
    if (!avatar) {
      throw new NotFoundException(`Blurred avatar with ID ${id} not found`);
    }

    // Soft delete by setting isActive to false
    avatar.isActive = false;
    await this.blurredAvatarRepository.save(avatar);
    
    this.logger.log(`Removed blurred avatar ${id}`);
  }

  private async processImage(imageUrl: string, blurLevel: number, userId: string): Promise<string> {
    try {
      // For now, we'll assume the image is accessible via URL
      // In production, you might want to download it first
      const filename = `${userId}_${Date.now()}_blur${blurLevel}.jpg`;
      const filepath = path.join(this.uploadPath, filename);

      // Download image if it's a URL
      let imageBuffer: Buffer;
      if (imageUrl.startsWith('http')) {
        // In a real implementation, you'd download the image
        // For now, we'll create a placeholder
        imageBuffer = Buffer.from('placeholder');
      } else {
        // If it's a local file path
        imageBuffer = fs.readFileSync(imageUrl);
      }

      // Process image with Sharp
      const processedBuffer = await sharp(imageBuffer)
        .blur(blurLevel)
        .jpeg({ quality: 80 })
        .toBuffer();

      // Save processed image
      fs.writeFileSync(filepath, processedBuffer);

      // Return the URL path
      const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3001');
      return `${baseUrl}/uploads/blurred-avatars/${filename}`;

    } catch (error) {
      this.logger.error(`Failed to process image: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process image');
    }
  }

  async getBlurredAvatarStats(userId: string): Promise<{
    totalAvatars: number;
    latestBlurLevel: number | null;
    lastUpdated: Date | null;
  }> {
    const avatars = await this.findAllByUserId(userId);
    const latest = avatars[0];

    return {
      totalAvatars: avatars.length,
      latestBlurLevel: latest?.blurLevel || null,
      lastUpdated: latest?.updatedAt || null,
    };
  }
}
