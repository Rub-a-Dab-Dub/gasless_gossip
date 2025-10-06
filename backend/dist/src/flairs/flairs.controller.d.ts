import { FlairsService } from './flairs.service';
import { CreateFlairDto } from './dto/create-flair.dto';
export declare class FlairsController {
    private readonly flairsService;
    constructor(flairsService: FlairsService);
    addFlair(req: any, dto: CreateFlairDto): Promise<import("./entities/flair.entity").Flair>;
    getUserFlairs(userId: string): Promise<import("./entities/flair.entity").Flair[]>;
}
