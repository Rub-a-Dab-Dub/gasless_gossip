import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PseudonymsService } from '../services/pseudonyms.service';
import { SetPseudonymDto } from '../dto/set-pseudonym.dto';
import { GetRoomPseudonymsParamsDto } from '../dto/get-room-pseudonyms.dto';

@Controller('pseudonyms')
export class PseudonymsController {
  constructor(private readonly service: PseudonymsService) {}

  @Post('set')
  async set(@Body() body: SetPseudonymDto) {
    const result = await this.service.setPseudonym(body.roomId, body.userId, body.pseudonym);
    return { id: result.id, roomId: result.roomId, userId: result.userId, pseudonym: result.pseudonym };
  }

  @Get(':roomId')
  async list(@Param() params: GetRoomPseudonymsParamsDto) {
    const list = await this.service.getRoomPseudonyms(params.roomId);
    return list.map((p) => ({ id: p.id, roomId: p.roomId, userId: p.userId, pseudonym: p.pseudonym }));
  }
}


