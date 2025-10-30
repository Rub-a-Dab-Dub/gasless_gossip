import { Body, Controller, Post, Param, Get, Query } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { TipUserDto } from './dto/tip-user.dto';
import { PayRoomEntryDto } from './dto/pay-room-entry.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private contractsService: ContractsService) {}

  @Post('starknet/tip')
  async tipStarknet(
    @Body('recipient') recipient: string,
    @Body('amountLow') low: string,
    @Body('amountHigh') high: string,
    @Body('context') context: string,
  ) {
    return this.contractsService.tipUserStarknet(
      recipient,
      { low, high },
      context,
    );
  }

  @Post('evm/:chain/tip')
  async tipEvm(
    @Param('chain') chain: 'base' | 'celo',
    @Body() dto: TipUserDto,
  ) {
    return this.contractsService.tipUserEvm(chain, dto);
  }

  @Post('evm/:chain/room-entry')
  async payRoomEntry(
    @Param('chain') chain: 'base' | 'celo',
    @Body() dto: PayRoomEntryDto,
  ) {
    return this.contractsService.payRoomEntryEvm(chain, dto);
  }

  @Post('user')
  async createUser(
    @Body() body: { chain: 'starknet' | 'base' | 'celo'; username: string },
  ) {
    if (body.chain === 'starknet') {
      return await this.contractsService.createUserStarknet(body.username);
    }
    return await this.contractsService.createUserEvm(body.chain, body.username);
  }

  @Get('user')
  async getUserAddress(
    @Query() query: { chain: 'starknet' | 'base' | 'celo'; username: string },
  ) {
    const { chain, username } = query;
    const address = await this.contractsService.getUserAddress(chain, username);
    return { address };
  }
}
