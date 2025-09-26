import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenTransaction } from './token-transaction.entity';
import { SendTokenDto } from './dto/send-token.dto';
import { ConfigService } from '@nestjs/config';
import { StellarAccount } from '../xp/stellar-account.entity';

const StellarSdk = require('stellar-sdk');

@Injectable()
export class TokensService {
  private readonly logger = new Logger(TokensService.name);

  constructor(
    @InjectRepository(TokenTransaction)
    private readonly tokenTxRepo: Repository<TokenTransaction>,
    @InjectRepository(StellarAccount)
    private readonly stellarAccountRepo: Repository<StellarAccount>,
    private readonly config: ConfigService,
  ) {}

  async send(dto: SendTokenDto) {
    const horizon =
      this.config.get<string>('STELLAR_HORIZON_URL') ||
      'https://horizon-testnet.stellar.org';
    const server = new StellarSdk.Server(horizon);

    const sourceSecret = this.config.get<string>('STELLAR_SENDER_SECRET');
    if (!sourceSecret) {
      throw new Error('STELLAR_SENDER_SECRET not configured');
    }
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
    const sourcePublic = sourceKeypair.publicKey();

    // Resolve destination: if dto.toId looks like a Stellar G... key, use directly; otherwise, map via table
    let destination = dto.toId;
    if (!/^G[A-Z2-7]{55}$/.test(destination)) {
      const mapping = await this.stellarAccountRepo.findOne({
        where: { userId: destination },
      });
      if (!mapping) {
        throw new Error('Destination user has no linked Stellar account');
      }
      destination = mapping.stellarAccount;
    }

    const assetCode = this.config.get<string>('STELLAR_ASSET_CODE');
    const assetIssuer = this.config.get<string>('STELLAR_ASSET_ISSUER');
    const asset =
      assetCode && assetIssuer
        ? new StellarSdk.Asset(assetCode, assetIssuer)
        : StellarSdk.Asset.native();

    const account = await server.loadAccount(sourcePublic);
    const fee = await server.fetchBaseFee();
    const networkPassphrase =
      this.config.get<string>('STELLAR_NETWORK_PASSPHRASE') ||
      StellarSdk.Networks.TESTNET;

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: fee.toString(),
      networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset,
          amount: dto.amount,
        }),
      )
      .setTimeout(60)
      .build();

    tx.sign(sourceKeypair);
    const result = await server.submitTransaction(tx);

    const logged = this.tokenTxRepo.create({
      fromId: dto.fromId,
      toId: dto.toId,
      amount: dto.amount,
      txId: result.hash,
    });
    await this.tokenTxRepo.save(logged);

    return { hash: result.hash, ledger: result.ledger, successful: true };
  }

  async history(userId: string) {
    return this.tokenTxRepo.find({
      where: [{ fromId: userId }, { toId: userId }],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
