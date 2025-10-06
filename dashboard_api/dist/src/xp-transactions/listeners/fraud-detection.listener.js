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
var FraudDetectionListener_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudDetectionListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let FraudDetectionListener = FraudDetectionListener_1 = class FraudDetectionListener {
    mailerService;
    configService;
    logger = new common_1.Logger(FraudDetectionListener_1.name);
    constructor(mailerService, configService) {
        this.mailerService = mailerService;
        this.configService = configService;
    }
    async handleFraudDetection(payload) {
        this.logger.warn(`Fraud alert: User ${payload.userId} earned ${payload.xpAmount} XP`);
        const adminEmails = this.configService.get('ADMIN_EMAILS', '').split(',');
        if (adminEmails.length > 0) {
            try {
                await this.mailerService.sendMail({
                    to: adminEmails,
                    subject: '🚨 XP Fraud Alert',
                    html: `
            <h2>Suspicious Activity Detected</h2>
            <p>User: ${payload.userId}</p>
            <p>XP Earned: ${payload.xpAmount} in 1 hour</p>
            <p>Threshold: ${payload.threshold}</p>
          `,
                });
            }
            catch (error) {
                this.logger.error(`Failed to send fraud alert: ${error.message}`);
            }
        }
    }
};
exports.FraudDetectionListener = FraudDetectionListener;
__decorate([
    (0, event_emitter_1.OnEvent)('fraud.detected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FraudDetectionListener.prototype, "handleFraudDetection", null);
exports.FraudDetectionListener = FraudDetectionListener = FraudDetectionListener_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof mailer_1.MailerService !== "undefined" && mailer_1.MailerService) === "function" ? _a : Object, config_1.ConfigService])
], FraudDetectionListener);
//# sourceMappingURL=fraud-detection.listener.js.map