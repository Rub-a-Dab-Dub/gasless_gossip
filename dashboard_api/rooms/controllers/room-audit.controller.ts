import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RoomAuditService } from '../services/room-audit.service';
import { ModeratorGuard } from '../guards/moderator.guard';
import {
  CreateRoomAuditDto,
  SearchRoomAuditDto,
  ExportRoomAuditDto,
} from '../dto/room-audit.dto';
import { RoomAudit } from '../entities/room-audit.entity';
import { Moderator } from '../../shared/decorators/roles.decorator';
import { ExportService } from '../services/export.service';

@ApiTags('room-audits')
@ApiBearerAuth()
@Controller('room-audits')
@UseGuards(ModeratorGuard)
export class RoomAuditController {
  constructor(
    private readonly roomAuditService: RoomAuditService,
    private readonly exportService: ExportService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room audit entry' })
  @ApiResponse({ type: RoomAudit })
  @Moderator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateRoomAuditDto): Promise<RoomAudit> {
    return this.roomAuditService.create(createDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search room audit entries' })
  @ApiResponse({ type: [RoomAudit] })
  @Moderator()
  async search(@Query() searchDto: SearchRoomAuditDto) {
    return this.roomAuditService.search(searchDto);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export room audit data' })
  @Moderator()
  async export(@Query() exportDto: ExportRoomAuditDto, @Res() res: Response) {
    const { data } = await this.roomAuditService.search(exportDto);
    
    const filename = `room-audits-export-${new Date().toISOString()}.${exportDto.format}`;
    
    if (exportDto.format === 'csv') {
      const csv = await this.exportService.convertToCsv(data);
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csv);
    } else {
      res.header('Content-Type', 'application/json');
      res.header('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(data);
    }
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Get anomalous room activities' })
  @ApiResponse({ type: [RoomAudit] })
  @Moderator()
  async getAnomalies(@Query() searchDto: SearchRoomAuditDto) {
    return this.roomAuditService.search({
      ...searchDto,
      isAnomalous: true,
    });
  }
}