import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralsService } from './services/referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { GenerateCodeDto } from './dto/generate-code.dto';
import { ReferralResponseDto } from './dto/referral-response.dto';

@ApiTags('referrals')
@Controller('referrals')
// @UseGuards(JwtAuthGuard) // Uncomment when you have auth guards
@ApiBearerAuth()
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new referral' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Referral created successfully',
    type: ReferralResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid referral data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already referred or invalid referral code',
  })
  async createReferral(@Body() createReferralDto: CreateReferralDto) {
    return await this.referralsService.createReferral(createReferralDto);
  }

  @Post('generate-code')
  @ApiOperation({ summary: 'Generate a referral code for a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Referral code generated successfully',
  })
  async generateReferralCode(@Body() generateCodeDto: GenerateCodeDto) {
    const referralCode = await this.referralsService.generateReferralCode(
      generateCodeDto.userId
    );
    return { referralCode };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get referral history for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Referral history retrieved successfully',
    type: [ReferralResponseDto],
  })
  async getReferralHistory(
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    return await this.referralsService.findReferralsByUser(userId);
  }

  @Get(':userId/stats')
  @ApiOperation({ summary: 'Get referral statistics for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Referral stats retrieved successfully',
  })
  async getReferralStats(
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    return await this.referralsService.getReferralStats(userId);
  }
}