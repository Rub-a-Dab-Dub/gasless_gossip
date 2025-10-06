"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stellarConfigFactory = exports.STELLAR_CONFIG_TOKEN = void 0;
exports.STELLAR_CONFIG_TOKEN = 'STELLAR_CONFIG';
const stellarConfigFactory = () => ({
    networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE ||
        'Test SDF Network ; September 2015',
    horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    badgeContractAddress: process.env.STELLAR_BADGE_CONTRACT_ADDRESS || '',
    sourceAccountSecret: process.env.STELLAR_SOURCE_SECRET || '',
    baseFee: process.env.STELLAR_BASE_FEE || '100',
    timeout: Number.parseInt(process.env.STELLAR_TIMEOUT || '30', 10),
});
exports.stellarConfigFactory = stellarConfigFactory;
//# sourceMappingURL=stellar.config.js.map