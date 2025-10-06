export declare class CodeGeneratorService {
    private readonly CHARACTERS;
    private readonly CODE_LENGTH;
    generateInvitationCode(): string;
    formatCodeForDisplay(code: string): string;
    validateCodeFormat(code: string): boolean;
    normalizeCode(code: string): string;
    generateShareableUrl(code: string, baseUrl?: string): string;
    generateQRCodeData(code: string): string;
}
