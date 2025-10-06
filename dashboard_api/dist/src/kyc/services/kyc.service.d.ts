import { Repository, DataSource } from 'typeorm';
import { Kyc } from './entities/kyc.entity';
import { KycAudit } from './entities/kyc-audit.entity';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycStatusDto } from './dto/update-kyc-status.dto';
import { QueryKycDto } from './dto/query-kyc.dto';
import { BulkApplyKycDto } from './dto/bulk-apply-kyc.dto';
import { DocumentStorageService } from './services/document-storage.service';
import { BlockchainVerifyService } from './services/blockchain-verify.service';
export declare class KycService {
    private kycRepo;
    private auditRepo;
    private dataSource;
    private docStorage;
    private blockchain;
    constructor(kycRepo: Repository<Kyc>, auditRepo: Repository<KycAudit>, dataSource: DataSource, docStorage: DocumentStorageService, blockchain: BlockchainVerifyService);
    create(dto: CreateKycDto, adminId: string): Promise<Kyc>;
    findAll(query: QueryKycDto): Promise<{
        data: Kyc[];
        meta: {
            page: QueryKycDto;
            limit: QueryKycDto;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Kyc>;
    findByUserId(userId: string): Promise<Kyc>;
    updateStatus(id: string, dto: UpdateKycStatusDto, adminId: string): Promise<Kyc>;
    uploadDocument(id: string, file: Express.Multer.File, docType: string, adminId: string): Promise<Kyc>;
    verifyOnChain(id: string, adminId: string): Promise<Kyc>;
    bulkApply(dto: BulkApplyKycDto, adminId: string): Promise<{
        updated: number;
        created: number;
    }>;
    private createAudit;
}
