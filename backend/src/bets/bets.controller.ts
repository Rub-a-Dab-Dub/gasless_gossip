import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BetsService } from './bets.service';
import { PlaceBetDto } from './dto/place-bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bets')
@UseGuards(AuthGuard)
export class BetsController {
  constructor(private betsService: BetsService) {}

  @Post('place')
  async placeBet(@Request() req: any, @Body() placeBetDto: PlaceBetDto) {
    return this.betsService.placeBet(req.user.id, placeBetDto);
  }

  @Post('resolve')
  async resolveBet(@Body() resolveBetDto: ResolveBetDto) {
    return this.betsService.resolveBet(resolveBetDto);
  }
}
