import { CsrfProtectionService } from './csrf-protection.service';
import { CsrfToken } from './interfaces/csrf-token.interface';
export declare class CsrfProtectionController {
    private readonly csrfProtectionService;
    constructor(csrfProtectionService: CsrfProtectionService);
    getCsrfToken(): CsrfToken;
}
