"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StellarListenerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarListenerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const xp_service_1 = require("./xp.service");
const StellarSdk = require('stellar-sdk');
let StellarListenerService = StellarListenerService_1 = class StellarListenerService {
    config;
    xpService;
    logger = new common_1.Logger(StellarListenerService_1.name);
    constructor(config, xpService) {
        this.config = config;
        this.xpService = xpService;
    }
    onModuleInit() {
        this.start();
    }
    start() {
        try {
            const horizon = this.config.get('STELLAR_HORIZON_URL') ||
                'https://horizon-testnet.stellar.org';
            const server = new StellarSdk.Server(horizon);
            server
                .payments()
                .cursor('now')
                .stream({
                onmessage: async (payment) => {
                    try {
                        const type = payment.type;
                        const from = payment.from || payment.source_account;
                        const eventId = payment.transaction_hash || payment.id || `${payment.id}`;
                        const xpEvent = {
                            eventId: `payment:${eventId}`,
                            type: 'token_send',
                            userId: from,
                            data: payment,
                        };
                        await this.xpService.handleEvent(xpEvent);
                    }
                    catch (err) {
                        this.logger.error('Error processing payment event', err);
                    }
                },
                onerror: (err) => {
                    this.logger.error('Stellar payment stream error', err);
                },
            });
            server
                .transactions()
                .cursor('now')
                .stream({
                onmessage: async (tx) => {
                    try {
                        const eventId = tx.id || tx.hash || tx.paging_token;
                        const memo = tx.memo;
                        if (memo) {
                            const xpEvent = {
                                eventId: `tx:${eventId}`,
                                type: 'message',
                                userId: tx.source_account,
                                data: { memo },
                            };
                            await this.xpService.handleEvent(xpEvent);
                        }
                    }
                    catch (err) {
                        this.logger.error('Error processing transaction event', err);
                    }
                },
                onerror: (err) => {
                    this.logger.error('Stellar transaction stream error', err);
                },
            });
            this.logger.log(`StellarListenerService connected to ${horizon}`);
        }
        catch (err) {
            this.logger.error('Failed to start StellarListenerService', err);
        }
    }
};
exports.StellarListenerService = StellarListenerService;
exports.StellarListenerService = StellarListenerService = StellarListenerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        xp_service_1.XpService])
], StellarListenerService);
//# sourceMappingURL=stellar-listener.service.js.map