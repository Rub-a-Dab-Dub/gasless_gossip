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
exports.WalletConnection = exports.ConnectionStatus = exports.WalletType = void 0;
const typeorm_1 = require("typeorm");
var WalletType;
(function (WalletType) {
    WalletType["FREIGHTER"] = "freighter";
    WalletType["ALBEDO"] = "albedo";
    WalletType["RABET"] = "rabet";
    WalletType["LUMENS"] = "lumens";
})(WalletType || (exports.WalletType = WalletType = {}));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["ACTIVE"] = "active";
    ConnectionStatus["DISCONNECTED"] = "disconnected";
    ConnectionStatus["PENDING"] = "pending";
    ConnectionStatus["FAILED"] = "failed";
})(ConnectionStatus || (exports.ConnectionStatus = ConnectionStatus = {}));
let WalletConnection = class WalletConnection {
    id;
    userId;
    walletType;
    address;
    status;
    publicKey;
    signature;
    metadata;
    lastUsedAt;
    createdAt;
    updatedAt;
};
exports.WalletConnection = WalletConnection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletConnection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], WalletConnection.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WalletType
    }),
    __metadata("design:type", String)
], WalletConnection.prototype, "walletType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 56, unique: true }),
    __metadata("design:type", String)
], WalletConnection.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConnectionStatus,
        default: ConnectionStatus.ACTIVE
    }),
    __metadata("design:type", String)
], WalletConnection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], WalletConnection.prototype, "publicKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000, nullable: true }),
    __metadata("design:type", String)
], WalletConnection.prototype, "signature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], WalletConnection.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WalletConnection.prototype, "lastUsedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WalletConnection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WalletConnection.prototype, "updatedAt", void 0);
exports.WalletConnection = WalletConnection = __decorate([
    (0, typeorm_1.Entity)('wallet_connections'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['walletType']),
    (0, typeorm_1.Index)(['address']),
    (0, typeorm_1.Index)(['status'])
], WalletConnection);
//# sourceMappingURL=wallet-connection.entity.js.map