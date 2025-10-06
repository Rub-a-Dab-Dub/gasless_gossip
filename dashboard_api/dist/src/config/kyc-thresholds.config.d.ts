declare const _default: (() => {
    thresholds: {
        none: {
            maxTransaction: number;
            maxDaily: number;
        };
        basic: {
            maxTransaction: number;
            maxDaily: number;
        };
        advanced: {
            maxTransaction: number;
            maxDaily: number;
        };
        premium: {
            maxTransaction: number;
            maxDaily: number;
        };
    };
    storage: {
        s3Bucket: string;
        region: string;
    };
    blockchain: {
        contractAddress: string | undefined;
        rpcUrl: string;
        privateKey: string | undefined;
    };
    document: {
        maxFileSize: number;
        allowedTypes: string[];
        expirySeconds: number;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    thresholds: {
        none: {
            maxTransaction: number;
            maxDaily: number;
        };
        basic: {
            maxTransaction: number;
            maxDaily: number;
        };
        advanced: {
            maxTransaction: number;
            maxDaily: number;
        };
        premium: {
            maxTransaction: number;
            maxDaily: number;
        };
    };
    storage: {
        s3Bucket: string;
        region: string;
    };
    blockchain: {
        contractAddress: string | undefined;
        rpcUrl: string;
        privateKey: string | undefined;
    };
    document: {
        maxFileSize: number;
        allowedTypes: string[];
        expirySeconds: number;
    };
}>;
export default _default;
