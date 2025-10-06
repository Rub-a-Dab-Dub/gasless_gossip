export interface CsrfToken {
    token: string;
    expiresAt: Date;
}
export interface CsrfValidationResult {
    isValid: boolean;
    message?: string;
}
