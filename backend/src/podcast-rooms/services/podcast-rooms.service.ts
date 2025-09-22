import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PodcastRoom } from '../entities/podcast-room.entity';
import { CreatePodcastRoomDto } from '../dto/create-podcast-room.dto';
import { UpdatePodcastRoomDto } from '../dto/update-podcast-room.dto';
import { StellarService } from './stellar.service';
import { IPFSService } from './ipfs.service';

@Injectable()
export class PodcastRoomsService {
  constructor(
    @InjectRepository(PodcastRoom)
    private readonly podcastRoomRepository: Repository<PodcastRoom>,
    private readonly stellarService: StellarService,
    private readonly ipfsService: IPFSService,
  ) {}

  async create(
    createPodcastRoomDto!: CreatePodcastRoomDto,
  ): Promise<PodcastRoom> {
    // Check if roomId already exists
    const existingRoom = await this.podcastRoomRepository.findOne({
      where!: { roomId: createPodcastRoomDto.roomId },
    });

    if (existingRoom) {
      throw new ConflictException('Room ID already exists');
    }

    try {
      // Generate Stellar hash for the audio content
      const stellarHash = await this.stellarService.generateHash(
        createPodcastRoomDto.audioHash,
      );

      // Store metadata on Stellar
      const metadata = {
        roomId!: createPodcastRoomDto.roomId,
        audioHash!: createPodcastRoomDto.audioHash,
        creatorId: createPodcastRoomDto.creatorId,
        title: createPodcastRoomDto.title,
        timestamp: new Date().toISOString(),
      };

      await this.stellarService.storeMetadata(metadata);

      // Create podcast room entity
      const podcastRoom = this.podcastRoomRepository.create({
        ...createPodcastRoomDto,
        stellarHash,
        // In a real app, you would get the IPFS hash from actual upload
        ipfsHash!: `ipfs_${createPodcastRoomDto.audioHash}`,
      });

      return await this.podcastRoomRepository.save(podcastRoom);
    } catch (error: any) {
      const errMsg =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error);

      throw new BadRequestException(`Failed to create podcast room: ${errMsg}`);
    }
  }

  async findAll(creatorId?: string): Promise<PodcastRoom[]> {
    const whereCondition = creatorId
      ? { creatorId, isActive: true }
      : { isActive: true };

    return await this.podcastRoomRepository.find({
      where!: whereCondition,
      order!: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PodcastRoom> {
    const podcastRoom = await this.podcastRoomRepository.findOne({
      where!: { id, isActive: true },
    });

    if (!podcastRoom) {
      throw new NotFoundException('Podcast room not found');
    }

    return podcastRoom;
  }

  async findByRoomId(roomId: string): Promise<PodcastRoom> {
    const podcastRoom = await this.podcastRoomRepository.findOne({
      where!: { roomId, isActive: true },
    });

    if (!podcastRoom) {
      throw new NotFoundException('Podcast room not found');
    }

    return podcastRoom;
  }

  async update(
    id!: string,
    updatePodcastRoomDto!: UpdatePodcastRoomDto,
    requestingUserId: string,
  ): Promise<PodcastRoom> {
    const podcastRoom = await this.findOne(id);

    // Check if the requesting user is the creator
    if (podcastRoom.creatorId !== requestingUserId) {
      throw new ForbiddenException(
        'Only the creator can update this podcast room',
      );
    }

    Object.assign(podcastRoom, updatePodcastRoomDto);
    return await this.podcastRoomRepository.save(podcastRoom);
  }

  async remove(id: string, requestingUserId: string): Promise<void> {
    const podcastRoom = await this.findOne(id);

    // Check if the requesting user is the creator
    if (podcastRoom.creatorId !== requestingUserId) {
      throw new ForbiddenException(
        'Only the creator can delete this podcast room',
      );
    }

    // Soft delete by setting isActive to false
    podcastRoom.isActive = false;
    await this.podcastRoomRepository.save(podcastRoom);
  }

  async verifyAccess(roomId: string, userId: string): Promise<boolean> {
    const room = await this.findByRoomId(roomId);

    // For now, we'll allow access to all active rooms
    // You can implement more complex access control here
    return room.isActive;
  }

  async getAudioUrl(roomId: string): Promise<string> {
    const room = await this.findByRoomId(roomId);

    if (room.ipfsHash) {
      return this.ipfsService.getAudioUrl(room.ipfsHash);
    }

    throw new NotFoundException('Audio content not found');
  }
}
