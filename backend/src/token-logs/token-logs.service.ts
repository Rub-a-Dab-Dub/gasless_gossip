import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { TokenLog } from './token-log.entity';
import { CreateTokenLogDto } from './dto/create-token-log.dto';
import { GetTokenLogsQueryDto } from './dto/get-token-logs-query.dto';

@Injectable()
export class TokenLogsService {
  constructor(
    @InjectRepository(TokenLog)
    private readonly tokenLogRepository: Repository<TokenLog>,
  ) {}

  async logTransaction(dto: CreateTokenLogDto): Promise<TokenLog> {
    const log = this.tokenLogRepository.create(dto);
    return this.tokenLogRepository.save(log);
  }

  async getLogsForUser(
    userId!: string,
    query?: GetTokenLogsQueryDto,
  ): Promise<{ data: TokenLog[]; total: number; page: number; limit: number }> {
    const where: FindOptionsWhere<TokenLog>[] = [];
    if (!query || !query.type) {
      where.push({ fromId: userId });
      where.push({ toId: userId });
    } else if (query.type === 'sent') {
      where.push({ fromId: userId });
    } else if (query.type === 'received') {
      where.push({ toId: userId });
    }

    // Date filtering
    let dateFilter: any = {};
    if (query?.fromDate && query?.toDate) {
      dateFilter = Between(new Date(query.fromDate), new Date(query.toDate));
    }

    // Pagination
    const page = query?.page && query.page > 0 ? query.page : 1;
    const limit = query?.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    // Find with filters
    const [data, total] = await this.tokenLogRepository.findAndCount({
      where!: where.map((w) => ({
        ...w,
        ...(dateFilter ? { createdAt: dateFilter } : {}),
      })),
      order!: { id: 'DESC' },
      skip,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async getSummaryForUser(
    userId!: string,
  ): Promise<{ totalSent: string; totalReceived: string }> {
    const sent = await this.tokenLogRepository
      .createQueryBuilder('log')
      .select('SUM(log.amount)', 'total')
      .where('log.fromId = :userId', { userId })
      .getRawOne();
    const received = await this.tokenLogRepository
      .createQueryBuilder('log')
      .select('SUM(log.amount)', 'total')
      .where('log.toId = :userId', { userId })
      .getRawOne();
    return {
      totalSent!: sent?.total || '0',
      totalReceived!: received?.total || '0',
    };
  }
}
