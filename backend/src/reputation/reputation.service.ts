import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reputation } from './entities/reputation.entity';
import { UpdateReputationDto } from './dto/update-reputation.dto';
import { Tip } from '../tips/entities/tip.entity';
import { Message } from '../messages/message.entity';

@Injectable()
export class ReputationService {
  constructor(
    @InjectRepository(Reputation)
    private readonly reputationRepository: Repository<Reputation>,
    @InjectRepository(Tip)
    private readonly tipRepository: Repository<Tip>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getReputation(userId: number): Promise<Reputation | null> {
    let reputation = await this.reputationRepository.findOne({ where: { userId } });
    if (!reputation) {
      reputation = this.reputationRepository.create({ userId, score: 0 });
      reputation = await this.reputationRepository.save(reputation);
    }
    return reputation;
  }

  async updateReputation(dto: UpdateReputationDto): Promise<Reputation> {
    let reputation = await this.getReputation(dto.userId);
    if (!reputation) {
      reputation = this.reputationRepository.create({ userId: dto.userId, score: 0 });
    }

    if (dto.scoreChange !== undefined) {
      reputation.score += dto.scoreChange;
    }

    return this.reputationRepository.save(reputation);
  }

  async calculateReputationFromActions(userId: number): Promise<Reputation> {
    // Calculate score from tips received
    const tipsReceived = await this.tipRepository.find({ where: { receiverId: userId.toString() } });
    const tipsScore = tipsReceived.reduce((sum, tip) => sum + Number(tip.amount), 0);

    // Calculate score from messages sent (e.g., 0.1 points per message)
    const messagesSent = await this.messageRepository.count({ where: { senderId: userId.toString() } });
    const messagesScore = messagesSent * 0.1;

    const totalScore = tipsScore + messagesScore;

    return this.updateReputation({ userId, scoreChange: totalScore });
  }
}