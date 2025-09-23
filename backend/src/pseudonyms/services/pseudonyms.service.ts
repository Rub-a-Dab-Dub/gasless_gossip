import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pseudonym } from '../entities/pseudonym.entity';

@Injectable()
export class PseudonymsService {
  constructor(
    @InjectRepository(Pseudonym)
    private readonly repo: Repository<Pseudonym>,
  ) {}

  async setPseudonym(roomId: string, userId: string, pseudonym: string): Promise<Pseudonym> {
    // Upsert-like behavior respecting unique constraints
    const existing = await this.repo.findOne({ where: { roomId, userId } });
    if (existing) {
      existing.pseudonym = pseudonym;
      return await this.repo.save(existing);
    }
    const created = this.repo.create({ roomId, userId, pseudonym });
    return await this.repo.save(created);
  }

  async getRoomPseudonyms(roomId: string): Promise<Pseudonym[]> {
    return await this.repo.find({ where: { roomId } });
  }
}


