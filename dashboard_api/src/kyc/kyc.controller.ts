import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { KycService } from './services/kyc.service';
import { KycThresholdService } from './services/kyc-threshold.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycStatusDto } from './dto/update-kyc-status.dto';
import { QueryKycDto } from './dto/query-kyc.dto';
import { BulkApplyKycDto } from './dto/bulk-apply-kyc.dto';
import { AdminKycGuard } from './guards/admin-kyc.guard';

@ApiTags('kyc')
@ApiBearerAuth()
@Controller('kyc')
@UseGuards(AdminKycGuard)
export class KycController {
  constructor(
    private readonly kycService: KycService,
    private readonly thresholdService: KycThresholdService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Flag user for KYC' })
  async create(@Body() dto: CreateKycDto, @Req() req: any) {
    const adminId = req.user.id;
    return this.kycService.create(dto, adminId);
  }

  @Get()
  @ApiOperation({ summary: 'List all KYC records with filters' })
  async findAll(@Query() query: QueryKycDto) {
    return this.kycService.findAll(query);
  }

  @Get('thresholds')
  @ApiOperation({ summary: 'Get KYC threshold configuration' })
  async getThresholds() {
    return {
      thresholds: this.thresholdService.getAllThresholds(),
    };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get KYC record by user ID' })
  async findByUserId(@Param('userId') userId: string) {
    return this.kycService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get KYC record by ID' })
  async findOne(@Param('id') id: string) {
    return this.kycService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update KYC status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateKycStatusDto,
    @Req() req: any,
  ) {
    const adminId = req.user.id;
    return this.kycService.updateStatus(id, dto, adminId);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload KYC document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('docType') docType: string,
    @Req() req: any,
  ) {
    const adminId = req.user.id;
    return this.kycService.uploadDocument(id, file, docType, adminId);
  }

  @Post(':id/verify-onchain')
  @ApiOperation({ summary: 'Submit KYC proof to blockchain' })
  async verifyOnChain(@Param('id') id: string, @Req() req: any) {
    const adminId = req.user.id;
    return this.kycService.verifyOnChain(id, adminId);
  }

  @Post('bulk-apply')
  @HttpCode(200)
  @ApiOperation({ summary: 'Bulk apply KYC status to multiple users' })
  async bulkApply(@Body() dto: BulkApplyKycDto, @Req() req: any) {
    const adminId = req.user.id;
    return this.kycService.bulkApply(dto, adminId);
  }
}