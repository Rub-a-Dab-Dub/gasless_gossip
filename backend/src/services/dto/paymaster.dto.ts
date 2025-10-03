import { IsString, IsOptional, IsNotEmpty, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendChatMessageDto {
  @ApiProperty({ description: 'Chat message content' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Room ID where the message is sent' })
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ description: 'Private key for the smart account' })
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}

export class SubmitIntentDto {
  @ApiProperty({ description: 'Intent data payload' })
  @IsString()
  @IsNotEmpty()
  intentData: string;

  @ApiProperty({ description: 'Type of intent being submitted' })
  @IsString()
  @IsNotEmpty()
  intentType: string;

  @ApiProperty({ description: 'Private key for the smart account' })
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}

export class SponsorUserOpDto {
  @ApiProperty({ description: 'Target contract address' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Encoded function call data' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'ETH value to send (in wei)', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: 'Gas limit for the transaction', required: false })
  @IsString()
  @IsOptional()
  gasLimit?: string;

  @ApiProperty({ description: 'Private key for the smart account' })
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}

export class UserOpRequestDto {
  @ApiProperty({ description: 'Target contract address' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Encoded function call data' })
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty({ description: 'ETH value to send (in wei)', required: false })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: 'Gas limit for the transaction', required: false })
  @IsString()
  @IsOptional()
  gasLimit?: string;
}

export class UserOpResponseDto {
  @ApiProperty({ description: 'Whether the operation was successful' })
  success: boolean;

  @ApiProperty({ description: 'UserOperation hash', required: false })
  userOpHash?: string;

  @ApiProperty({ description: 'Transaction hash', required: false })
  txHash?: string;

  @ApiProperty({ description: 'Error message if operation failed', required: false })
  error?: string;

  @ApiProperty({ description: 'Gas used for the transaction', required: false })
  gasUsed?: string;

  @ApiProperty({ description: 'Gas price for the transaction', required: false })
  gasPrice?: string;
}

export class PaymasterStatusDto {
  @ApiProperty({ description: 'Whether paymaster is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Paymaster balance in ETH' })
  balance: string;

  @ApiProperty({ description: 'Network name' })
  network: string;

  @ApiProperty({ description: 'Chain ID' })
  chainId: number;

  @ApiProperty({ description: 'Last status check timestamp' })
  lastChecked: Date;
}

export class RateLimitStatusDto {
  @ApiProperty({ description: 'Remaining operations in current window' })
  remaining: number;

  @ApiProperty({ description: 'Reset time for rate limit window' })
  resetTime: number;

  @ApiProperty({ description: 'Maximum operations per minute' })
  limit: number;
}

export class GasEstimateDto {
  @ApiProperty({ description: 'Estimated call gas limit' })
  callGasLimit: string;

  @ApiProperty({ description: 'Estimated verification gas limit' })
  verificationGasLimit: string;

  @ApiProperty({ description: 'Estimated pre-verification gas' })
  preVerificationGas: string;
}
