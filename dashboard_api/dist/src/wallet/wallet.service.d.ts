import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletService {
    create(createWalletDto: CreateWalletDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateWalletDto: UpdateWalletDto): string;
    remove(id: number): string;
}
