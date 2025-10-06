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
exports.PredictionVote = void 0;
const typeorm_1 = require("typeorm");
const prediction_entity_1 = require("./prediction.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let PredictionVote = class PredictionVote {
    id;
    predictionId;
    userId;
    isCorrect;
    rewardAmount;
    rewardClaimed;
    txId;
    prediction;
    user;
    createdAt;
};
exports.PredictionVote = PredictionVote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PredictionVote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prediction_id' }),
    __metadata("design:type", String)
], PredictionVote.prototype, "predictionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], PredictionVote.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], PredictionVote.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 7, default: 0 }),
    __metadata("design:type", Number)
], PredictionVote.prototype, "rewardAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reward_claimed', default: false }),
    __metadata("design:type", Boolean)
], PredictionVote.prototype, "rewardClaimed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_id', nullable: true }),
    __metadata("design:type", String)
], PredictionVote.prototype, "txId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prediction_entity_1.Prediction, prediction => prediction.votes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'prediction_id' }),
    __metadata("design:type", prediction_entity_1.Prediction)
], PredictionVote.prototype, "prediction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], PredictionVote.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PredictionVote.prototype, "createdAt", void 0);
exports.PredictionVote = PredictionVote = __decorate([
    (0, typeorm_1.Entity)('prediction_votes'),
    (0, typeorm_1.Unique)(['predictionId', 'userId'])
], PredictionVote);
//# sourceMappingURL=prediction-vote.entity.js.map