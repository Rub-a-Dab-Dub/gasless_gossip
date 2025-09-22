import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { StellarService } from './stellar.service';

@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Get('status')
  getStatus() {
    return this.stellarService.getStatus();
  }

  @Get('account')
  async getAccount(@Query('publicKey') publicKey: string) {
    if (!publicKey) {
      return { error: 'Missing publicKey query param' };
    }
    try {
      const account = await this.stellarService.loadAccount(publicKey);
      return {
        publicKey: account.account_id,
        balances: account.balances,
        sequence: account.sequence,
        subentryCount: account.subentry_count,
      };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @Get('account/balance')
  async getAccountBalance(
    @Query('publicKey') publicKey: string,
    @Query('assetCode') assetCode?: string,
  ) {
    if (!publicKey) {
      return { error: 'Missing publicKey query param' };
    }
    try {
      const balance = await this.stellarService.getAccountBalance(publicKey, assetCode);
      return { balance, assetCode: assetCode || 'XLM' };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @Get('create-keypair')
  createKeypair() {

  }
}
