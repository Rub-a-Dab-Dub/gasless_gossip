"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const event_emitter_1 = require("@nestjs/event-emitter");
const nft_entity_1 = require("./entities/nft.entity");
const nft_collection_entity_1 = require("./entities/nft-collection.entity");
const nft_transfer_history_entity_1 = require("./entities/nft-transfer-history.entity");
const nfts_controller_1 = require("./controllers/nfts.controller");
const collections_controller_1 = require("./controllers/collections.controller");
const nfts_service_1 = require("./services/nfts.service");
const stellar_nft_service_1 = require("./services/stellar-nft.service");
const transfer_logger_service_1 = require("./services/transfer-logger.service");
const transfer_logger_listener_1 = require("./listeners/transfer-logger.listener");
let NftsModule = class NftsModule {
};
exports.NftsModule = NftsModule;
exports.NftsModule = NftsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([nft_entity_1.Nft, nft_collection_entity_1.NftCollection, nft_transfer_history_entity_1.NftTransferHistory]), config_1.ConfigModule, event_emitter_1.EventEmitterModule],
        controllers: [nfts_controller_1.NftsController, collections_controller_1.CollectionsController],
        providers: [nfts_service_1.NftsService, stellar_nft_service_1.StellarNftService, transfer_logger_service_1.TransferLoggerService, transfer_logger_listener_1.TransferLoggerListener],
        exports: [nfts_service_1.NftsService, stellar_nft_service_1.StellarNftService, transfer_logger_service_1.TransferLoggerService],
    })
], NftsModule);
//# sourceMappingURL=nfts.module.js.map