// src/gambles/gambles.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GamblesService } from './gambles.service';
import { CreateGambleDto } from './dto/create-gamble.dto';
import { ResolveGambleDto } from './dto/resolve-gamble.dto';

@Controller('gambles')
export class GamblesController {
  constructor(private readonly gamblesService: GamblesService) {}

  @Post()
  create(@Body() dto: CreateGambleDto) {
    return this.gamblesService.create(dto);
  }

  @Post('resolve')
  resolve(@Body() dto: ResolveGambleDto) {
    return this.gamblesService.resolve(dto);
  }

  @Get()
  findAll() {
    return this.gamblesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamblesService.findOne(id);
  }
}
