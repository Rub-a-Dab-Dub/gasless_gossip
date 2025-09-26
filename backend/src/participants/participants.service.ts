import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './participant.entity';
import { JoinParticipantDto, LeaveParticipantDto } from './dto/participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
  ) {}

  async join(userId: string, dto: JoinParticipantDto): Promise<Participant> {
    const existing = await this.participantRepo.findOne({
      where: { roomId: dto.roomId, pseudonym: dto.pseudonym },
    });

    if (existing) {
      throw new ConflictException('Pseudonym already taken in this room');
    }

    const participant = this.participantRepo.create({
      userId,
      roomId: dto.roomId,
      pseudonym: dto.pseudonym,
    });

    return this.participantRepo.save(participant);
  }

  async findByRoom(roomId: string): Promise<Participant[]> {
    return this.participantRepo.find({ where: { roomId } });
  }

  async leave(userId: string, dto: LeaveParticipantDto): Promise<void> {
    const participant = await this.participantRepo.findOne({
      where: { roomId: dto.roomId, userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found in this room');
    }

    await this.participantRepo.remove(participant);
  }
}
