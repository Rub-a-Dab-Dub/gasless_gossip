import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SendTokenDto } from './dto/send-token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('send')
  @UsePipes(new ValidationPipe({ transform: true }))
  async send(@Body() dto: SendTokenDto) {
    return this.tokensService.send(dto);
  }

  @Get('history/:userId')
  async history(@Param('userId') userId: string) {
    const entries = await this.tokensService.history(userId);
    return { userId, entries };
  }
}


