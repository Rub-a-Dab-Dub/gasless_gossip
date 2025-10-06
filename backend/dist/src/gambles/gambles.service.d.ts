import { Repository } from 'typeorm';
import { Gamble } from './entities/gamble.entity';
import { CreateGambleDto } from './dto/create-gamble.dto';
import { ResolveGambleDto } from './dto/resolve-gamble.dto';
export declare class GamblesService {
    private gambleRepo;
    constructor(gambleRepo: Repository<Gamble>);
    create(dto: CreateGambleDto): Promise<Gamble>;
    resolve(dto: ResolveGambleDto): Promise<Gamble>;
    findAll(): Promise<Gamble[]>;
    findOne(id: string): Promise<Gamble | null>;
}
