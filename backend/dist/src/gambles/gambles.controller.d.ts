import { GamblesService } from './gambles.service';
import { CreateGambleDto } from './dto/create-gamble.dto';
import { ResolveGambleDto } from './dto/resolve-gamble.dto';
export declare class GamblesController {
    private readonly gamblesService;
    constructor(gamblesService: GamblesService);
    create(dto: CreateGambleDto): Promise<import("./entities/gamble.entity").Gamble>;
    resolve(dto: ResolveGambleDto): Promise<import("./entities/gamble.entity").Gamble>;
    findAll(): Promise<import("./entities/gamble.entity").Gamble[]>;
    findOne(id: string): Promise<import("./entities/gamble.entity").Gamble | null>;
}
