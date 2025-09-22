import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoDeleteService } from '../services/auto-delete.service';
import { AutoDelete } from '../entities/auto-delete.entity';
import { Message } from '../../messages/message.entity';
import { StellarService } from '../../stellar/stellar.service';

describe('AutoDeleteService', () => {
  let service: AutoDeleteService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [AutoDelete, Message],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([AutoDelete, Message]),
      ],
      providers: [AutoDeleteService, StellarService],
    }).compile();

    service = moduleRef.get(AutoDeleteService);
  });

  it('deletes messages after expiry', async () => {
    // create message
    const repo: any = (service as any).messageRepo;
    const msg = await repo.save(
      repo.create({ roomId: 'room', contentHash: 'hash', senderId: 'u1' }),
    );

    // set timer in the past
    const past = new Date(Date.now() - 5000).toISOString();
    await service.setTimer({ messageId: msg.id, expiry: past });

    // process
    await service.processExpired();

    const exists = await repo.findOne({ where: { id: msg.id } });
    expect(exists).toBeNull();
  });
});


