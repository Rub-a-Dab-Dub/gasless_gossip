import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from './bet.entity';
import { PlaceBetDto } from './dto/place-bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';
// import * as StellarSdk from 'stellar-sdk';

@Injectable()
export class BetsService {
  // private server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

  constructor(
    @InjectRepository(Bet)
    private betRepo: Repository<Bet>,
  ) {}

  async placeBet(userId: string, placeBetDto: PlaceBetDto): Promise<Bet> {
    const escrowTxId = await this.createEscrow(userId, placeBetDto.stakes);
    
    const bet = this.betRepo.create({
      ...placeBetDto,
      userId,
      txId: escrowTxId,
    });

    return this.betRepo.save(bet);
  }

  async resolveBet(resolveBetDto: ResolveBetDto): Promise<Bet> {
    const bet = await this.betRepo.findOne({ where: { id: resolveBetDto.betId } });
    if (!bet) throw new Error('Bet not found');

    await this.resolveEscrow(bet.txId, resolveBetDto.won);
    
    bet.status = resolveBetDto.won ? 'won' : 'lost';
    return this.betRepo.save(bet);
  }

  private async createEscrow(userId: string, amount: number): Promise<string> {
    // Mock escrow creation - returns transaction ID
    return `escrow_${Date.now()}_${userId}`;
  }

  private async resolveEscrow(txId: string, won: boolean): Promise<void> {
    // Mock escrow resolution
    console.log(`Resolving escrow ${txId}: ${won ? 'release' : 'return'} funds`);
  }
}