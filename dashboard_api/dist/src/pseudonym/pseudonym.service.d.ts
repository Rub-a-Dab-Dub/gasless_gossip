import { CreatePseudonymDto } from './dto/create-pseudonym.dto';
import { UpdatePseudonymDto } from './dto/update-pseudonym.dto';
export declare class PseudonymService {
    create(createPseudonymDto: CreatePseudonymDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePseudonymDto: UpdatePseudonymDto): string;
    remove(id: number): string;
}
