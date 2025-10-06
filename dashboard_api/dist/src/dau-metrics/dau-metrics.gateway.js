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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DauMetricsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
let DauMetricsGateway = class DauMetricsGateway {
    dauMetricsService;
    server;
    constructor(dauMetricsService) {
        this.dauMetricsService = dauMetricsService;
    }
    handleTrackUsage(data, client) {
        try {
            const usage = this.dauMetricsService.trackFeatureUsage(data);
            this.server.emit("usage-tracked", {
                featureName: usage.featureName,
                userId: usage.userId,
                timestamp: usage.usageTimestamp,
            });
            return { success: true, data: usage };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    handleSubscribeDau(data, client) {
        const room = data.featureName ? `dau-${data.featureName}` : "dau-all";
        client.join(room);
        return { success: true, message: `Subscribed to ${room}` };
    }
    handleUnsubscribeDau(data, client) {
        const room = data.featureName ? `dau-${data.featureName}` : "dau-all";
        client.leave(room);
        return { success: true, message: `Unsubscribed from ${room}` };
    }
    broadcastDauUpdate(featureName, data) {
        this.server.to(`dau-${featureName}`).emit("dau-update", data);
        this.server.to("dau-all").emit("dau-update", data);
    }
    broadcastAlert(alert) {
        this.server.emit("dau-alert", alert);
    }
};
exports.DauMetricsGateway = DauMetricsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], DauMetricsGateway.prototype, "server", void 0);
exports.DauMetricsGateway = DauMetricsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
        namespace: "/dau-metrics",
    }),
    __metadata("design:paramtypes", [Function])
], DauMetricsGateway);
//# sourceMappingURL=dau-metrics.gateway.js.map