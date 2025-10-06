export interface StellarConfig {
    networkPassphrase: string;
    horizonUrl: string;
    badgeContractAddress: string;
    sourceAccountSecret: string;
    baseFee: string;
    timeout: number;
}
export declare const STELLAR_CONFIG_TOKEN = "STELLAR_CONFIG";
export declare const stellarConfigFactory: () => StellarConfig;
