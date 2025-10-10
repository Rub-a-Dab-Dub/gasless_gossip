import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import { RoomAudit } from '../entities/room-audit.entity';

@Injectable()
export class ExportService {
  async convertToCsv(data: RoomAudit[]): Promise<string> {
    const parser = new Parser({
      fields: [
        'id',
        'roomId',
        'creatorId',
        'action',
        {
          label: 'Room Type',
          value: 'metadata.roomType',
        },
        {
          label: 'Max Participants',
          value: 'metadata.maxParticipants',
        },
        {
          label: 'XP Required',
          value: 'metadata.xpRequired',
        },
        'description',
        'createdAt',
        'isAnomalous',
        'anomalyScore',
      ],
      flatten: true,
    });

    return parser.parse(data);
  }
}