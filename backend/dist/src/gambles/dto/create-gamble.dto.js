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
exports.ResolveGambleDto = exports.CreateGambleDto = void 0;
const class_validator_1 = require("class-validator");
class CreateGambleDto {
    gossipId;
    userId;
    amount;
    choice;
    txId;
}
exports.CreateGambleDto = CreateGambleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGambleDto.prototype, "gossipId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGambleDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateGambleDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['truth', 'fake']),
    __metadata("design:type", String)
], CreateGambleDto.prototype, "choice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGambleDto.prototype, "txId", void 0);
class ResolveGambleDto {
    gambleId;
    outcome;
}
exports.ResolveGambleDto = ResolveGambleDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResolveGambleDto.prototype, "gambleId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['truth', 'fake']),
    __metadata("design:type", String)
], ResolveGambleDto.prototype, "outcome", void 0);
//# sourceMappingURL=create-gamble.dto.js.map