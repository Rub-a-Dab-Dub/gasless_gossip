import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymasterService, UserOpRequest, UserOpResponse, PaymasterStatus } from './paymaster.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  SendChatMessageDto, 
  SubmitIntentDto, 
  SponsorUserOpDto, 
  UserOpRequestDto,
  UserOpResponseDto,
  PaymasterStatusDto,
  RateLimitStatusDto,
  GasEstimateDto
} from './dto/paymaster.dto';

@ApiTags('Paymaster')
@Controller('paymaster')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymasterController {
  constructor(private readonly paymasterService: PaymasterService) {}

  @Post('sponsor-userop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sponsor a UserOperation for gasless transaction' })
  @ApiResponse({ status: 200, description: 'UserOperation sponsored successfully', type: UserOpResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request or rate limit exceeded' })
  async sponsorUserOperation(
    @Body() sponsorDto: SponsorUserOpDto,
    @Request() req: any
  ): Promise<UserOpResponseDto> {
    try {
      const smartAccount = await this.paymasterService.createSmartAccount(sponsorDto.privateKey);
      
      const userOpRequest: UserOpRequest = {
        to: sponsorDto.to,
        data: sponsorDto.data,
        value: sponsorDto.value || '0',
        gasLimit: sponsorDto.gasLimit,
      };

      return await this.paymasterService.sponsorUserOperation(
        smartAccount,
        userOpRequest,
        req.user.id
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('send-chat-message')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a gasless chat message' })
  @ApiResponse({ status: 200, description: 'Chat message sent successfully', type: UserOpResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request or rate limit exceeded' })
  async sendGaslessChatMessage(
    @Body() chatDto: SendChatMessageDto,
    @Request() req: any
  ): Promise<UserOpResponseDto> {
    try {
      const smartAccount = await this.paymasterService.createSmartAccount(chatDto.privateKey);
      
      return await this.paymasterService.sendGaslessChatMessage(
        smartAccount,
        chatDto.message,
        chatDto.roomId,
        req.user.id
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('submit-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a gasless intent' })
  @ApiResponse({ status: 200, description: 'Intent submitted successfully', type: UserOpResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request or rate limit exceeded' })
  async submitGaslessIntent(
    @Body() intentDto: SubmitIntentDto,
    @Request() req: any
  ): Promise<UserOpResponseDto> {
    try {
      const smartAccount = await this.paymasterService.createSmartAccount(intentDto.privateKey);
      
      return await this.paymasterService.submitGaslessIntent(
        smartAccount,
        intentDto.intentData,
        intentDto.intentType,
        req.user.id
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('status')
  @ApiOperation({ summary: 'Get paymaster status and balance' })
  @ApiResponse({ status: 200, description: 'Paymaster status retrieved successfully', type: PaymasterStatusDto })
  async getPaymasterStatus(): Promise<PaymasterStatusDto> {
    return await this.paymasterService.getPaymasterStatus();
  }

  @Get('can-sponsor')
  @ApiOperation({ summary: 'Check if paymaster can sponsor transactions' })
  @ApiResponse({ status: 200, description: 'Sponsorship capability checked' })
  async canSponsor(): Promise<{ canSponsor: boolean }> {
    const canSponsor = await this.paymasterService.canSponsor();
    return { canSponsor };
  }

  @Get('rate-limit/:userId')
  @ApiOperation({ summary: 'Get rate limit status for a user' })
  @ApiResponse({ status: 200, description: 'Rate limit status retrieved', type: RateLimitStatusDto })
  async getRateLimitStatus(@Param('userId') userId: string): Promise<RateLimitStatusDto> {
    return this.paymasterService.getRateLimitStatus(userId);
  }

  @Post('estimate-gas')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Estimate gas for a UserOperation' })
  @ApiResponse({ status: 200, description: 'Gas estimation completed', type: GasEstimateDto })
  async estimateGas(@Body() userOpRequest: UserOpRequestDto): Promise<GasEstimateDto> {
    return await this.paymasterService.estimateGas(userOpRequest);
  }

  @Get('test/base-sepolia')
  @ApiOperation({ summary: 'Test paymaster integration on Base Sepolia' })
  @ApiResponse({ status: 200, description: 'Test completed successfully' })
  async testBaseSepolia() {
    const status = await this.paymasterService.getPaymasterStatus();
    const canSponsor = await this.paymasterService.canSponsor();
    
    return {
      network: 'base-sepolia',
      chainId: 84532,
      rpcUrl: 'https://sepolia.base.org',
      paymasterStatus: status,
      canSponsor,
      testPassed: status.isActive && canSponsor,
      timestamp: new Date().toISOString(),
    };
  }
}
