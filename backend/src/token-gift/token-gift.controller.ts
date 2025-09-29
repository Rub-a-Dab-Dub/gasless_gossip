import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TokenGiftService } from './services/token-gift.service';
import { CreateTokenGiftDto, TokenGiftResponseDto, GasEstimateDto, PaymasterStatusDto } from './dto/token-gift.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('gift')
@UseGuards(JwtAuthGuard)
export class TokenGiftController {
  constructor(private readonly tokenGiftService: TokenGiftService) {}

  @Post('token')
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 token gifts per minute
  async createTokenGift(
    @Body(new ValidationPipe({ transform: true })) dto: CreateTokenGiftDto,
    @Request() req: any,
  ): Promise<TokenGiftResponseDto> {
    return this.tokenGiftService.createTokenGift(dto, req.user.id);
  }

  @Get('token/:giftId')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async getTokenGift(@Param('giftId') giftId: string): Promise<TokenGiftResponseDto> {
    return this.tokenGiftService.getTokenGift(giftId);
  }

  @Get('token/user/:userId')
  @Throttle({ short: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async getUserTokenGifts(
    @Param('userId') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Request() req: any,
  ) {
    // Users can only view their own gifts (unless admin)
    if (userId !== req.user.id && !req.user.isAdmin) {
      throw new Error('Unauthorized: Cannot view other users gifts');
    }

    return this.tokenGiftService.getUserTokenGifts(userId, limit || 20);
  }

  @Get('token/:giftId/transactions')
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  async getTokenGiftTransactions(@Param('giftId') giftId: string) {
    return this.tokenGiftService.getTokenGiftTransactions(giftId);
  }

  @Post('token/estimate-gas')
  @Throttle({ short: { limit: 50, ttl: 60000 } }) // 50 gas estimates per minute
  async estimateGas(@Body() dto: CreateTokenGiftDto): Promise<GasEstimateDto> {
    return this.tokenGiftService.getGasEstimate(dto);
  }

  @Get('token/paymaster-status/:network')
  @Throttle({ short: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async getPaymasterStatus(@Param('network') network: string): Promise<PaymasterStatusDto> {
    return this.tokenGiftService.getPaymasterStatus(network);
  }

  @Get('token/performance')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  async getPerformanceMetrics() {
    return this.tokenGiftService.getPerformanceMetrics();
  }

  // Test endpoints for Stellar Testnet and Base Sepolia
  @Post('test/stellar-testnet')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 test requests per minute
  async testStellarTestnet(
    @Body() dto: CreateTokenGiftDto,
    @Request() req: any,
  ): Promise<TokenGiftResponseDto> {
    // Force testnet network
    const testDto = { ...dto, network: 'stellar' as const };
    return this.tokenGiftService.createTokenGift(testDto, req.user.id);
  }

  @Post('test/base-sepolia')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 test requests per minute
  async testBaseSepolia(
    @Body() dto: CreateTokenGiftDto,
    @Request() req: any,
  ): Promise<TokenGiftResponseDto> {
    // Force base network
    const testDto = { ...dto, network: 'base' as const };
    return this.tokenGiftService.createTokenGift(testDto, req.user.id);
  }

  @Get('test/stellar-testnet/status')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async getStellarTestnetStatus(): Promise<{
    network: string;
    horizonUrl: string;
    networkPassphrase: string;
    status: string;
  }> {
    return {
      network: 'stellar-testnet',
      horizonUrl: 'https://horizon-testnet.stellar.org',
      networkPassphrase: 'Test SDF Network ; September 2015',
      status: 'active',
    };
  }

  @Get('test/base-sepolia/status')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async getBaseSepoliaStatus(): Promise<{
    network: string;
    rpcUrl: string;
    chainId: number;
    status: string;
  }> {
    return {
      network: 'base-sepolia',
      rpcUrl: 'https://sepolia.base.org',
      chainId: 84532,
      status: 'active',
    };
  }

  @Post('test/simulate-transaction')
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async simulateTransaction(
    @Body() dto: CreateTokenGiftDto,
  ): Promise<{
    simulated: boolean;
    estimatedGas: GasEstimateDto;
    paymasterStatus: PaymasterStatusDto;
    processingTime: string;
  }> {
    const startTime = Date.now();
    
    const [estimatedGas, paymasterStatus] = await Promise.all([
      this.tokenGiftService.getGasEstimate(dto),
      this.tokenGiftService.getPaymasterStatus(dto.network),
    ]);

    const processingTime = Date.now() - startTime;

    return {
      simulated: true,
      estimatedGas,
      paymasterStatus,
      processingTime: `${processingTime}ms`,
    };
  }
}
