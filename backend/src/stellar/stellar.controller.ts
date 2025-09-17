import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { StellarService } from './stellar.service';
import { xdr } from '@stellar/stellar-sdk';

@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) {}

  @Get('status')
  async getStatus() {
    return this.stellarService.getStatus();
  }

  @Post('create-account')
  async createAccount() {
    return this.stellarService.createAccount();
  }

}
