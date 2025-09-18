import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './reaction.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async addReaction(dto: CreateReactionDto): Promise<Reaction> {
    // TODO: Enforce message access control here
    const reaction = this.reactionRepository.create(dto);
    const saved = await this.reactionRepository.save(reaction);
    // TODO: Trigger XP update for userId
    return saved;
  }

  async getReactionsForMessage(messageId: string): Promise<Reaction[]> {
    return this.reactionRepository.find({ where: { messageId } });
  }

  async countReactions(messageId: string): Promise<{ [type: string]: number }> {
    const reactions = await this.getReactionsForMessage(messageId);
    return reactions.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {} as { [type: string]: number });
  }
}
