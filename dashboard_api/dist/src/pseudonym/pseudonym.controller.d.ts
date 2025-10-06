import { PseudonymService } from './pseudonym.service';
import { CreatePseudonymDto } from './dto/create-pseudonym.dto';
import { UpdatePseudonymDto } from './dto/update-pseudonym.dto';
export declare class PseudonymController {
    private readonly pseudonymService;
    constructor(pseudonymService: PseudonymService);
    create(createPseudonymDto: CreatePseudonymDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePseudonymDto: UpdatePseudonymDto): string;
    remove(id: string): string;
}
