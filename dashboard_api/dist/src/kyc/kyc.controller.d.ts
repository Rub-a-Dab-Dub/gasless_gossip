import { KycService } from './services/kyc.service';
import { KycThresholdService } from './services/kyc-threshold.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycStatusDto } from './dto/update-kyc-status.dto';
import { QueryKycDto } from './dto/query-kyc.dto';
import { BulkApplyKycDto } from './dto/bulk-apply-kyc.dto';
export declare class KycController {
    private readonly kycService;
    private readonly thresholdService;
    constructor(kycService: KycService, thresholdService: KycThresholdService);
    create(dto: CreateKycDto, req: any): Promise<Kyc>;
    findAll(query: QueryKycDto): Promise<{
        data: Kyc[];
        meta: {
            page: QueryKycDto;
            limit: QueryKycDto;
            total: number;
            totalPages: number;
        };
    }>;
    getThresholds(): Promise<{
        thresholds: import("./services/kyc-threshold.service").ThresholdConfig[];
    }>;
    findByUserId(userId: string): Promise<Kyc>;
    findOne(id: string): Promise<Kyc>;
    updateStatus(id: string, dto: UpdateKycStatusDto, req: any): Promise<Kyc>;
    uploadDocument(id: string, file: Express.Multer.File, docType: string, req: any): Promise<Kyc>;
    verifyOnChain(id: string, req: any): Promise<Kyc>;
    bulkApply(dto: BulkApplyKycDto, req: any): Promise<{
        updated: number;
        created: number;
    }>;
}
