import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from '../entities/participant.entity';

@Injectable()
export class RoomExportService {
  constructor(
    @InjectRepository(Participant)
    private participantRepo: Repository<Participant>,
  ) {}

  async exportParticipantActivity(roomId: string): Promise<string> {
    const participants = await this.participantRepo.find({
      where: { roomId },
      relations: ['room'],
    });

    const headers = 'User ID,Pseudonym,Message Count,Reaction Count,Joined At\n';
    const rows = participants.map(p =>
      `${p.userId},${p.pseudonym},${p.messageCount},${p.reactionCount},${p.joinedAt.toISOString()}`
    ).join('\n');

    return headers + rows;
  }
}