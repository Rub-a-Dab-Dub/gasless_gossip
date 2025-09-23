import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { BansService } from './bans.service';
import { CreateBanDto } from './dto/create-ban.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus } from './entities/report.entity';
// Import your auth guards
// import { JwtAuthGuard, AdminGuard } from '../auth/guards';

@Controller('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  // Ban endpoints
  @Post()
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  @HttpCode(HttpStatus.CREATED)
  async createBan(@Body() createBanDto: CreateBanDto) {
    return await this.bansService.createBan(createBanDto);
  }

  @Get('check/:userId')
  async checkBanStatus(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.bansService.getBanByUserId(userId);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  async getAllBans(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return await this.bansService.getAllBans(page, limit);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  @HttpCode(HttpStatus.NO_CONTENT)
  async liftBan(
    @Param('id', ParseUUIDPipe) id: string,
    // @Request() req, // Uncomment when you have auth
  ) {
    // const liftedBy = req.user?.id; // Uncomment when you have auth
    await this.bansService.liftBan(id /* , liftedBy */);
  }
}

@Controller('reports')
export class ReportsController {
  constructor(private readonly bansService: BansService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Uncomment when you have auth guards
  @HttpCode(HttpStatus.CREATED)
  async createReport(
    @Body() createReportDto: CreateReportDto,
    // @Request() req, // Uncomment when you have auth
  ) {
    // const reporterId = req.user.id; // Uncomment when you have auth
    const reporterId = 'temp-reporter-id'; // Remove this line when auth is implemented
    return await this.bansService.createReport(reporterId, createReportDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  async getReports(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('status') status?: ReportStatus,
  ) {
    return await this.bansService.getReports(page, limit, status);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  async getReport(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bansService.getReportById(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  async updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return await this.bansService.updateReport(id, updateReportDto);
  }

  @Get('user/:userId')
  // @UseGuards(JwtAuthGuard, AdminGuard) // Uncomment when you have auth guards
  async getUserReports(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return await this.bansService.getUserReports(userId, page, limit);
  }
}
