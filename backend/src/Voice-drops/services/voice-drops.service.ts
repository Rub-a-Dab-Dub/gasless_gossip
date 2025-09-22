import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoiceDrop } from '../entities/voice-drop.entity';
import { CreateVoiceDropDto, VoiceDropResponseDto, GetVoiceDropsDto } from '../dto';
import { IpfsService } from './ipfs.service';
import { StellarService } from './stellar.service';

@Injectable()
export class VoiceDropsService {
  constructor(
    @InjectRepository(VoiceDrop)
    private voiceDropRepository: Repository<VoiceDrop>,
    private ipfsService: IpfsService,
    private stellarService: StellarService,
  ) {}

  async createVoiceDrop(
    createVoiceDropDto: CreateVoiceDropDto,
    audioFile: Express.Multer.File,
    userId: string,
  ): Promise<VoiceDropResponseDto> {
    // TODO: Add room access validation
    // await this.validateRoomAccess(createVoiceDropDto.roomId, userId);

    // Upload to IPFS
    const ipfsResult = await this.ipfsService.uploadAudioFile(audioFile);

    // Create Stellar hash
    const stellarResult = await this.stellarService.createStellarHash(
      ipfsResult.hash,
      {
        roomId: createVoiceDropDto.roomId,
        creatorId: userId,
        fileName: createVoiceDropDto.fileName,
        duration: createVoiceDropDto.duration,
      }
    );

    // Save to database
    const voiceDrop = this.voiceDropRepository.create({
      roomId: createVoiceDropDto.roomId,
      audioHash: ipfsResult.hash,
      stellarHash: stellarResult.hash,
      creatorId: userId,
      fileName: createVoiceDropDto.fileName,
      duration: createVoiceDropDto.duration,
      fileSize: createVoiceDropDto.fileSize,
      mimeType: createVoiceDropDto.mimeType,
    });

    const savedVoiceDrop = await this.voiceDropRepository.save(voiceDrop);

    return this.toResponseDto(savedVoiceDrop);
  }

  async getVoiceDropsByRoom(
    roomId: string,
    query: GetVoiceDropsDto,
    userId: string,
  ): Promise<{ data: VoiceDropResponseDto[]; total: number; page: number; limit: number }> {
    // TODO: Add room access validation
    // await this.validateRoomAccess(roomId, userId);

    const { page = 1, limit = 20, creatorId } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.voiceDropRepository
      .createQueryBuilder('voiceDrop')
      .where('voiceDrop.roomId = :roomId', { roomId })
      .orderBy('voiceDrop.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (creatorId) {
      queryBuilder.andWhere('voiceDrop.creatorId = :creatorId', { creatorId });
    }

    const [voiceDrops, total] = await queryBuilder.getManyAndCount();

    const data = voiceDrops.map(vd => this.toResponseDto(vd));

    return { data, total, page, limit };
  }

  async getVoiceDropById(id: string, userId: string): Promise<VoiceDropResponseDto> {
    const voiceDrop = await this.voiceDropRepository.findOne({ where: { id } });

    if (!voiceDrop) {
      throw new NotFoundException('Voice drop not found');
    }

    // TODO: Add room access validation
    // await this.validateRoomAccess(voiceDrop.roomId, userId);

    return this.toResponseDto(voiceDrop);
  }

  async deleteVoiceDrop(id: string, userId: string): Promise<void> {
    const voiceDrop = await this.voiceDropRepository.findOne({ where: { id } });

    if (!voiceDrop) {
      throw new NotFoundException('Voice drop not found');
    }

    if (voiceDrop.creatorId !== userId) {
      throw new ForbiddenException('You can only delete your own voice drops');
    }

    await this.voiceDropRepository.remove(voiceDrop);
  }

  private toResponseDto(voiceDrop: VoiceDrop): VoiceDropResponseDto {
    return {
      id: voiceDrop.id,
      roomId: voiceDrop.roomId,
      audioHash: voiceDrop.audioHash,
      stellarHash: voiceDrop.stellarHash,
      creatorId: voiceDrop.creatorId,
      fileName: voiceDrop.fileName,
      duration: voiceDrop.duration,
      fileSize: voiceDrop.fileSize,
      mimeType: voiceDrop.mimeType,
      audioUrl: this.ipfsService.getAudioUrl(voiceDrop.audioHash),
      createdAt: voiceDrop.createdAt,
    };
  }

  // TODO: Implement room access validation
  private async validateRoomAccess(roomId: string, userId: string): Promise<void> {
    // This should check if the user has access to the room
    // For now, we'll skip this validation
    return;
  }
}
