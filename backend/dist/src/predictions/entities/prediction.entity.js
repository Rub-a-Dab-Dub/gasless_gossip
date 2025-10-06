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
exports.Prediction = exports.PredictionOutcome = exports.PredictionStatus = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("../../rooms/entities/room.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const prediction_vote_entity_1 = require("./prediction-vote.entity");
var PredictionStatus;
(function (PredictionStatus) {
    PredictionStatus["ACTIVE"] = "active";
    PredictionStatus["RESOLVED"] = "resolved";
    PredictionStatus["CANCELLED"] = "cancelled";
})(PredictionStatus || (exports.PredictionStatus = PredictionStatus = {}));
var PredictionOutcome;
(function (PredictionOutcome) {
    PredictionOutcome["CORRECT"] = "correct";
    PredictionOutcome["INCORRECT"] = "incorrect";
    PredictionOutcome["PENDING"] = "pending";
})(PredictionOutcome || (exports.PredictionOutcome = PredictionOutcome = {}));
let Prediction = class Prediction {
    id;
    roomId;
    userId;
    title;
    description;
    prediction;
    expiresAt;
    status;
    outcome;
    voteCount;
    correctVotes;
    incorrectVotes;
    rewardPool;
    rewardPerCorrectVote;
    isResolved;
    resolvedAt;
    room;
    user;
    votes;
    createdAt;
    updatedAt;
};
exports.Prediction = Prediction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Prediction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id' }),
    __metadata("design:type", String)
], Prediction.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Prediction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Prediction.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Prediction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Prediction.prototype, "prediction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'expires_at' }),
    __metadata("design:type", Date)
], Prediction.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PredictionStatus,
        default: PredictionStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Prediction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PredictionOutcome,
        default: PredictionOutcome.PENDING,
    }),
    __metadata("design:type", String)
], Prediction.prototype, "outcome", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vote_count', default: 0 }),
    __metadata("design:type", Number)
], Prediction.prototype, "voteCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'correct_votes', default: 0 }),
    __metadata("design:type", Number)
], Prediction.prototype, "correctVotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incorrect_votes', default: 0 }),
    __metadata("design:type", Number)
], Prediction.prototype, "incorrectVotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 7, name: 'reward_pool', default: 0 }),
    __metadata("design:type", Number)
], Prediction.prototype, "rewardPool", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 18, scale: 7, name: 'reward_per_correct_vote', default: 0 }),
    __metadata("design:type", Number)
], Prediction.prototype, "rewardPerCorrectVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_resolved', default: false }),
    __metadata("design:type", Boolean)
], Prediction.prototype, "isResolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', name: 'resolved_at', nullable: true }),
    __metadata("design:type", Date)
], Prediction.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room),
    (0, typeorm_1.JoinColumn)({ name: 'room_id' }),
    __metadata("design:type", room_entity_1.Room)
], Prediction.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Prediction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => prediction_vote_entity_1.PredictionVote, vote => vote.prediction),
    __metadata("design:type", Array)
], Prediction.prototype, "votes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Prediction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Prediction.prototype, "updatedAt", void 0);
exports.Prediction = Prediction = __decorate([
    (0, typeorm_1.Entity)('predictions')
], Prediction);
//# sourceMappingURL=prediction.entity.js.map