import { Controller, Get, Query } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';

@Controller('stellar')
export class StellarController {
  private server: any;

  constructor() {
    this.server = new StellarSdk.Horizon.Server(
      'https://horizon-testnet.stellar.org',
    );
  }

  @Get('account')
  async getAccount(@Query('publicKey') publicKey: string) {
    if (!publicKey) {
      return { error: 'Missing publicKey query param' };
    }
    try {
      const account = await this.server.loadAccount(publicKey);
      return account.balances;
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @Get('create-keypair')
  createKeypair() {
    const pair = StellarSdk.Keypair.random();
    return {
      publicKey!: pair.publicKey(),
      secret: pair.secret(),
    };
  }
}
