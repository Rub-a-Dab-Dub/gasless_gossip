import { CsrfToken, CsrfValidationResult } from './interfaces/csrf-token.interface';
export declare class CsrfProtectionService {
    private readonly secret;
    private readonly tokenExpiry;
    generateToken(): CsrfToken;
    validateToken(token: string): CsrfValidationResult;
}
