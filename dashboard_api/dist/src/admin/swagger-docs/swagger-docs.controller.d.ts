import { SwaggerDocsService } from './swagger-docs.service';
export declare class SwaggerDocsController {
    private readonly swaggerDocsService;
    constructor(swaggerDocsService: SwaggerDocsService);
    exportOpenApi(): any;
    getTags(): string[];
    updateExamples(examples: any): {
        message: string;
        examples: any;
    };
    deleteVersion(version: string): {
        message: string;
    };
    simulateAuth(body: {
        token: string;
    }): {
        message: string;
        token: string;
    };
}
