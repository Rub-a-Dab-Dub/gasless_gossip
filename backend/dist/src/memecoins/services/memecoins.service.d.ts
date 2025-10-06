import { Repository } from 'typeorm';
import { MemecoinDrop } from '../entities/memecoin-drop.entity';
import { CreateDropDto } from '../dto/create-drop.dto';
import { StellarService } from './stellar.service';
export declare class MemecoinsService {
    private memecoinDropRepository;
    private stellarService;
    private readonly logger;
    constructor(memecoinDropRepository: Repository<MemecoinDrop>, stellarService: StellarService);
    createDrop(createDropDto: CreateDropDto): Promise<MemecoinDrop>;
    getUserDrops(userId: string, page?: number, limit?: number): Promise<{
        drops: MemecoinDrop[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAllDrops(page?: number, limit?: number): Promise<{
        drops: MemecoinDrop[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getDropById(id: string): Promise<MemecoinDrop>;
    retryFailedDrop(id: string): Promise<MemecoinDrop>;
}
