import { Controller, Post, Body } from '@nestjs/common';
import { ProposeTradeDto } from './dto/propose-trade.dto';
import { AcceptTradeDto } from './dto/accept-trade.dto';
import { TradesService } from './trade.service';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post('propose')
  proposeTrade(@Body() dto: ProposeTradeDto) {
    return this.tradesService.proposeTrade(dto);
  }

  @Post('accept')
  acceptTrade(@Body() dto: AcceptTradeDto) {
    return this.tradesService.acceptTrade(dto);
  }
}
