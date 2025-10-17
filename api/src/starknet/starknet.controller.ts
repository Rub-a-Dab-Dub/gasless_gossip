import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { StarknetService } from './starknet.service';
// import { CONTRACTS } from './starknet.constant';

@Controller('starknet')
export class StarknetController {
  constructor(private readonly starknetService: StarknetService) {}

  // async onModuleInit() {
  //   await this.starknetService.initializeContract(CONTRACTS);
  // }
  
  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return await this.starknetService.getBalance(address);
  }

  @Get('block-number')
  async getBlockNumber() {
    return await this.starknetService.getBlockNumber();
  }

  @Get('transaction/:hash')
  async getTransactionStatus(@Param('hash') hash: string) {
    return await this.starknetService.getTransactionStatus(hash);
  }

  @Post('read')
  async readContract(@Body() body: { functionName: string; args?: any[] }) {
    return await this.starknetService.read(body.functionName, body.args || []);
  }

  @Post('write')
  async writeContract(@Body() body: { functionName: string; args?: any[] }) {
    return await this.starknetService.write(body.functionName, body.args || []);
  }
}
