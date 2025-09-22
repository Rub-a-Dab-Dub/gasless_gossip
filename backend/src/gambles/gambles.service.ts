// src/gambles/gambles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gamble } from './entities/gamble.entity';
import { CreateGambleDto } from './dto/create-gamble.dto';
import { ResolveGambleDto } from './dto/resolve-gamble.dto';

@Injectable()
export class GamblesService {
  constructor(
    @InjectRepository(Gamble)
    private gambleRepo: Repository<Gamble>,
  ) {}

  async create(dto: CreateGambleDto) {
    const gamble = await this.gambleRepo.findOne({ where: { gossipId: dto.gossipId } });

    if (gamble) {
      gamble.bets.push({
        userId!: dto.userId,
        amount!: dto.amount,
        choice: dto.choice,
        txId: dto.txId,
      });
      return this.gambleRepo.save(gamble);
    }

    const newGamble = this.gambleRepo.create({
      gossipId!: dto.gossipId,
      bets!: [
        {
          userId: dto.userId,
          amount: dto.amount,
          choice: dto.choice,
          txId: dto.txId,
        },
      ],
    });

    return this.gambleRepo.save(newGamble);
  }

  async resolve(dto: ResolveGambleDto) {
    const gamble = await this.gambleRepo.findOne({ where: { id: dto.gambleId } });
    if (!gamble) throw new NotFoundException('Gamble not found');

    gamble.resolvedChoice = dto.outcome;

    // 🔥 TODO: Add Stellar escrow payout logic here
    // Example: distribute winnings to users who bet on dto.outcome

    return this.gambleRepo.save(gamble);
  }

  async findAll() {
    return this.gambleRepo.find();
  }

  async findOne(id: string) {
    return this.gambleRepo.findOne({ where: { id } });
  }
}
