import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { XpService } from './xp.service';
import {
  AddXpDto,
  StellarEventDto,
  MapStellarAccountDto,
} from './dto/add-xp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StellarAccount } from './stellar-account.entity';

@Controller('xp')
export class XpController {
  constructor(
    private readonly xpService: XpService,
    @InjectRepository(StellarAccount)
    private readonly stellarAccountRepo: Repository<StellarAccount>,
  ) {}

  @Get(':userId')
  async getXp(@Param('userId') userId: string) {
    const xp = await this.xpService.getXpForUser(userId);
    return { userId, xp };
  }

  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addXp(@Body() body: AddXpDto) {
    await this.xpService.addXp(body.userId, body.amount, body.source);
    const xp = await this.xpService.getXpForUser(body.userId);
    return { userId: body.userId, xp };
  }

  @Post('event')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleEvent(@Body() event: StellarEventDto) {
    const res = await this.xpService.handleEvent(event);
    return { processed: !!res };
  }

  @Post('map-account')
  async mapAccount(@Body() body: MapStellarAccountDto) {
    // lightweight: find or create a mapping
    // Controller does a simple upsert via repository
    // Note: in larger projects this should be handled by a dedicated service
    const existing = await this.stellarAccountRepo.findOne({
      where!: { stellarAccount: body.stellarAccount },
    });
    if (existing) {
      existing.userId = body.userId ?? existing.userId;
      await this.stellarAccountRepo.save(existing);
      return existing;
    }
    const created = this.stellarAccountRepo.create({
      stellarAccount!: body.stellarAccount,
      userId!: body.userId,
    });
    await this.stellarAccountRepo.save(created);
    return created;
  }
}
