import { Repository } from 'typeorm';
import { Pseudonym } from '../entities/pseudonym.entity';
export declare class PseudonymsService {
    private readonly repo;
    constructor(repo: Repository<Pseudonym>);
    setPseudonym(roomId: string, userId: string, pseudonym: string): Promise<Pseudonym>;
    getRoomPseudonyms(roomId: string): Promise<Pseudonym[]>;
}
