"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoVotingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const dao_voting_controller_1 = require("./dao-voting.controller");
const dao_voting_service_1 = require("./dao-voting.service");
const stellar_voting_service_1 = require("./stellar-voting.service");
const vote_entity_1 = require("./vote.entity");
let DaoVotingModule = class DaoVotingModule {
};
exports.DaoVotingModule = DaoVotingModule;
exports.DaoVotingModule = DaoVotingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([vote_entity_1.Vote]),
            config_1.ConfigModule,
        ],
        controllers: [dao_voting_controller_1.DaoVotingController],
        providers: [dao_voting_service_1.DaoVotingService, stellar_voting_service_1.StellarVotingService],
        exports: [dao_voting_service_1.DaoVotingService, stellar_voting_service_1.StellarVotingService],
    })
], DaoVotingModule);
//# sourceMappingURL=dao-voting.module.js.map