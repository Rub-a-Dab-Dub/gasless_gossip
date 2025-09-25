import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { WalletIntegrationService } from './services/wallet-integration.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { WalletResponseDto, WalletStatsDto } from './dto/wallet-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('wallet-integration')
@Controller('wallets')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class WalletIntegrationController {
  constructor(private readonly walletIntegrationService: WalletIntegrationService) {}

  @Post('connect')
  @ApiOperation({ summary: 'Connect a new wallet' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Wallet connected successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid wallet data or validation failed',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Wallet address already connected',
  })
  async connectWallet(
    @Request() req: any,
    @Body() connectWalletDto: ConnectWalletDto
  ): Promise<WalletResponseDto> {
    const userId = req.user.sub;
    return await this.walletIntegrationService.connectWallet(userId, connectWalletDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wallets' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallets retrieved successfully',
    type: [WalletResponseDto],
  })
  async getUserWallets(@Request() req: any): Promise<WalletResponseDto[]> {
    const userId = req.user.sub;
    return await this.walletIntegrationService.getUserWallets(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get wallet statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet stats retrieved successfully',
    type: WalletStatsDto,
  })
  async getWalletStats(@Request() req: any): Promise<WalletStatsDto> {
    const userId = req.user.sub;
    return await this.walletIntegrationService.getWalletStats(userId);
  }

  @Get(':walletId')
  @ApiOperation({ summary: 'Get specific wallet details' })
  @ApiParam({ name: 'walletId', description: 'Wallet ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet details retrieved successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wallet not found',
  })
  async getWalletById(
    @Request() req: any,
    @Param('walletId', ParseUUIDPipe) walletId: string
  ): Promise<WalletResponseDto> {
    const userId = req.user.sub;
    return await this.walletIntegrationService.getWalletById(walletId, userId);
  }

  @Get(':walletId/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiParam({ name: 'walletId', description: 'Wallet ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet balance retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wallet not found',
  })
  async getWalletBalance(
    @Request() req: any,
    @Param('walletId', ParseUUIDPipe) walletId: string
  ) {
    const userId = req.user.sub;
    return await this.walletIntegrationService.getWalletBalance(walletId, userId);
  }

  @Post(':walletId/send')
  @ApiOperation({ summary: 'Send transaction from wallet' })
  @ApiParam({ name: 'walletId', description: 'Wallet ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid transaction data or wallet not active',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wallet not found',
  })
  async sendTransaction(
    @Request() req: any,
    @Param('walletId', ParseUUIDPipe) walletId: string,
    @Body() transactionDto: TransactionRequestDto
  ) {
    const userId = req.user.sub;
    return await this.walletIntegrationService.sendTransaction(walletId, userId, transactionDto);
  }

  @Delete(':walletId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disconnect wallet' })
  @ApiParam({ name: 'walletId', description: 'Wallet ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Wallet disconnected successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Wallet not found',
  })
  async disconnectWallet(
    @Request() req: any,
    @Param('walletId', ParseUUIDPipe) walletId: string
  ): Promise<void> {
    const userId = req.user.sub;
    return await this.walletIntegrationService.disconnectWallet(walletId, userId);
  }
}
