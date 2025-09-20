import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { ProposeTradeDto } from './dto/propose-trade.dto';
import { AcceptTradeDto } from './dto/accept-trade.dto';
import {
  Keypair,
  TransactionBuilder,
  Networks,
  Operation,
  Server,
} from 'stellar-sdk';

@Injectable()
export class TradesService {
  private server = new Server('https://horizon-testnet.stellar.org');
  private issuerKeypair = Keypair.fromSecret(process.env.STELLAR_ISSUER_SECRET);

  constructor(
    @InjectRepository(Trade)
    private tradeRepo: Repository<Trade>,
  ) {}

  async proposeTrade(dto: ProposeTradeDto): Promise<Trade> {
    const trade = this.tradeRepo.create({
      offerId: dto.offerId,
    });
    return this.tradeRepo.save(trade);
  }

  async acceptTrade(dto: AcceptTradeDto): Promise<Trade> {
    const trade = await this.tradeRepo.findOne({ where: { id: dto.tradeId } });
    if (!trade) throw new NotFoundException('Trade not found');

    // build escrow transaction (simplified)
    const account = await this.server.loadAccount(
      this.issuerKeypair.publicKey(),
    );
    const tx = new TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: dto.acceptorId, // here assume acceptorId is Stellar pubkey
          asset: undefined, // use your collectible asset
          amount: '1', // placeholder amount
        }),
      )
      .setTimeout(30)
      .build();

    tx.sign(this.issuerKeypair);
    const result = await this.server.submitTransaction(tx);

    trade.acceptorId = dto.acceptorId;
    trade.txId = result.hash;

    return this.tradeRepo.save(trade);
  }
}
