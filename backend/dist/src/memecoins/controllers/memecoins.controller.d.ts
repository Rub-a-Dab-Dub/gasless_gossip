import { MemecoinsService } from '../services/memecoins.service';
import { CreateDropDto } from '../dto/create-drop.dto';
import { GetUserDropsDto } from '../dto/user-drops.dto';
import { DropHistoryDto } from '../dto/drop-history.dto';
export declare class MemecoinsController {
    private readonly memecoinsService;
    constructor(memecoinsService: MemecoinsService);
    createDrop(createDropDto: CreateDropDto): Promise<DropHistoryDto>;
    getUserDrops(userId: string, query: GetUserDropsDto): Promise<{
        drops: import("../entities/memecoin-drop.entity").MemecoinDrop[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getAllDrops(query: GetUserDropsDto): Promise<{
        drops: import("../entities/memecoin-drop.entity").MemecoinDrop[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getDropById(id: string): Promise<DropHistoryDto>;
    retryDrop(id: string): Promise<DropHistoryDto>;
}
