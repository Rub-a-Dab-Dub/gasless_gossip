"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PollsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const poll_entity_1 = require("../entities/poll.entity");
const poll_vote_entity_1 = require("../entities/poll-vote.entity");
const room_access_service_1 = require("../../invitations/services/room-access.service");
const users_service_1 = require("../../users/users.service");
const StellarSdk = __importStar(require("stellar-sdk"));
let PollsService = PollsService_1 = class PollsService {
    pollRepo;
    voteRepo;
    roomAccess;
    usersService;
    logger = new common_1.Logger(PollsService_1.name);
    server;
    constructor(pollRepo, voteRepo, roomAccess, usersService) {
        this.pollRepo = pollRepo;
        this.voteRepo = voteRepo;
        this.roomAccess = roomAccess;
        this.usersService = usersService;
        this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    }
    async createPoll(dto, creatorId) {
        await this.roomAccess.verifyRoomAdmin(dto.roomId, creatorId);
        const poll = this.pollRepo.create({
            roomId: dto.roomId,
            question: dto.question,
            options: dto.options,
        });
        return this.pollRepo.save(poll);
    }
    async listPollsForRoom(roomId, requesterId) {
        await this.roomAccess.verifyRoomAccess(roomId, requesterId);
        return this.pollRepo.find({ where: { roomId }, order: { createdAt: 'DESC' } });
    }
    async vote(dto, userId) {
        const poll = await this.pollRepo.findOne({ where: { id: dto.pollId } });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        await this.roomAccess.verifyRoomAccess(poll.roomId, userId);
        if (dto.optionIndex < 0 || dto.optionIndex >= poll.options.length) {
            throw new common_1.BadRequestException('Invalid option index');
        }
        const weight = await this.getStellarWeightForUser(userId);
        let vote = await this.voteRepo.findOne({ where: { pollId: poll.id, userId } });
        if (!vote) {
            vote = this.voteRepo.create({ pollId: poll.id, userId, optionIndex: dto.optionIndex, weight });
        }
        else {
            vote.optionIndex = dto.optionIndex;
            vote.weight = weight;
        }
        await this.voteRepo.save(vote);
        const { tallies, weights } = await this.tallyPoll(poll.id);
        return { poll, tallies, weights };
    }
    async tallyPoll(pollId) {
        const poll = await this.pollRepo.findOne({ where: { id: pollId } });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        const votes = await this.voteRepo.find({ where: { pollId } });
        const tallies = new Array(poll.options.length).fill(0);
        const weights = new Array(poll.options.length).fill(0);
        for (const v of votes) {
            tallies[v.optionIndex] += 1;
            weights[v.optionIndex] += v.weight || 0;
        }
        return { tallies, weights };
    }
    async getStellarWeightForUser(userId) {
        try {
            const user = await this.usersService.findOne(userId);
            const publicKey = user?.stellarAccountId;
            if (!publicKey)
                return 1;
            const account = await this.server.loadAccount(publicKey);
            const assetCode = process.env.POLLS_WEIGHT_ASSET_CODE;
            const assetIssuer = process.env.POLLS_WEIGHT_ASSET_ISSUER;
            if (!assetCode || !assetIssuer) {
                const xlm = account.balances.find((b) => b.asset_type === 'native');
                return xlm ? Math.max(1, Math.min(10, Math.floor(parseFloat(xlm.balance)))) : 1;
            }
            const bal = account.balances.find((b) => b.asset_type !== 'native' && b.asset_code === assetCode && b.asset_issuer === assetIssuer);
            if (!bal)
                return 1;
            const amount = parseFloat(bal.balance);
            const weight = Math.max(1, Math.floor(1 + Math.log10(Math.max(amount, 1))));
            return weight;
        }
        catch (e) {
            this.logger.warn(`Weight lookup failed, defaulting to 1: ${e.message}`);
            return 1;
        }
    }
};
exports.PollsService = PollsService;
exports.PollsService = PollsService = PollsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(poll_entity_1.Poll)),
    __param(1, (0, typeorm_1.InjectRepository)(poll_vote_entity_1.PollVote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        room_access_service_1.RoomAccessService,
        users_service_1.UsersService])
], PollsService);
//# sourceMappingURL=polls.service.js.map