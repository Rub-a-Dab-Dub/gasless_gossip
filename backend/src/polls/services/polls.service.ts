import { Injectable, BadRequestException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from '../entities/poll.entity';
import { PollVote } from '../entities/poll-vote.entity';
import { CreatePollDto } from '../dto/create-poll.dto';
import { VoteDto } from '../dto/vote.dto';
import { RoomAccessService } from '../../invitations/services/room-access.service';
import { UsersService } from '../../users/users.service';
import * as StellarSdk from 'stellar-sdk';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  private server: StellarSdk.Horizon.Server;

  constructor(
    @InjectRepository(Poll) private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollVote) private readonly voteRepo: Repository<PollVote>,
    private readonly roomAccess: RoomAccessService,
    private readonly usersService: UsersService,
  ) {
    this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
  }

  async createPoll(dto: CreatePollDto, creatorId: string): Promise<Poll> {
    // verify admin/creator rights for the room
    await this.roomAccess.verifyRoomAdmin(dto.roomId, creatorId);

    const poll = this.pollRepo.create({
      roomId: dto.roomId,
      question: dto.question,
      options: dto.options,
    });
    return this.pollRepo.save(poll);
  }

  async listPollsForRoom(roomId: string, requesterId: string): Promise<Poll[]> {
    // must have access to the room
    await this.roomAccess.verifyRoomAccess(roomId, requesterId);
    return this.pollRepo.find({ where: { roomId }, order: { createdAt: 'DESC' } });
  }

  async vote(dto: VoteDto, userId: string): Promise<{ poll: Poll; tallies: number[]; weights: number[] }> {
    const poll = await this.pollRepo.findOne({ where: { id: dto.pollId } });
    if (!poll) throw new NotFoundException('Poll not found');

    // must have access to the room to vote
    await this.roomAccess.verifyRoomAccess(poll.roomId, userId);

    if (dto.optionIndex < 0 || dto.optionIndex >= poll.options.length) {
      throw new BadRequestException('Invalid option index');
    }

    // compute weight based on Stellar holdings (example: non-native asset specified via env; fallback 1)
    const weight = await this.getStellarWeightForUser(userId);

    // upsert vote (unique pollId + userId)
    let vote = await this.voteRepo.findOne({ where: { pollId: poll.id, userId } });
    if (!vote) {
      vote = this.voteRepo.create({ pollId: poll.id, userId, optionIndex: dto.optionIndex, weight });
    } else {
      vote.optionIndex = dto.optionIndex;
      vote.weight = weight;
    }
    await this.voteRepo.save(vote);

    const { tallies, weights } = await this.tallyPoll(poll.id);
    return { poll, tallies, weights };
  }

  async tallyPoll(pollId: string): Promise<{ tallies: number[]; weights: number[] }> {
    const poll = await this.pollRepo.findOne({ where: { id: pollId } });
    if (!poll) throw new NotFoundException('Poll not found');

    const votes = await this.voteRepo.find({ where: { pollId } });
    const tallies = new Array(poll.options.length).fill(0);
    const weights = new Array(poll.options.length).fill(0);

    for (const v of votes) {
      tallies[v.optionIndex] += 1;
      weights[v.optionIndex] += v.weight || 0;
    }
    return { tallies, weights };
  }

  private async getStellarWeightForUser(userId: string): Promise<number> {
    try {
      const user = await this.usersService.findOne(userId);
      const publicKey = user?.stellarAccountId;
      if (!publicKey) return 1;

      const account = await this.server.loadAccount(publicKey);
      const assetCode = process.env.POLLS_WEIGHT_ASSET_CODE;
      const assetIssuer = process.env.POLLS_WEIGHT_ASSET_ISSUER;

      if (!assetCode || !assetIssuer) {
        // fallback: use XLM balance scaled
        const xlm = account.balances.find((b) => b.asset_type === 'native');
        return xlm ? Math.max(1, Math.min(10, Math.floor(parseFloat(xlm.balance)))) : 1;
      }

      const bal = account.balances.find(
        (b) => b.asset_type !== 'native' && b.asset_code === assetCode && b.asset_issuer === assetIssuer,
      );
      if (!bal) return 1;
      const amount = parseFloat(bal.balance);
      // simple weighting: 1 + log10(amount)
      const weight = Math.max(1, Math.floor(1 + Math.log10(Math.max(amount, 1))))
      return weight;
    } catch (e) {
      this.logger.warn(`Weight lookup failed, defaulting to 1: ${(e as Error).message}`);
      return 1;
    }
  }
}


