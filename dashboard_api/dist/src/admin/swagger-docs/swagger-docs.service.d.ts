export declare class SwaggerDocsService {
    getDocument(): any;
    getTags(): string[];
    updateExamples(examples: any): {
        message: string;
        examples: any;
    };
    deleteVersion(version: string): {
        message: string;
    };
    simulateAuth(token: string): {
        message: string;
        token: string;
    };
}
