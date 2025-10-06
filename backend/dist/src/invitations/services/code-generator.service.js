"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let CodeGeneratorService = class CodeGeneratorService {
    CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    CODE_LENGTH = 12;
    generateInvitationCode() {
        const bytes = (0, crypto_1.randomBytes)(this.CODE_LENGTH);
        let result = "";
        for (let i = 0; i < this.CODE_LENGTH; i++) {
            result += this.CHARACTERS[bytes[i] % this.CHARACTERS.length];
        }
        return result;
    }
    formatCodeForDisplay(code) {
        return code.replace(/(.{3})/g, "$1-").slice(0, -1);
    }
    validateCodeFormat(code) {
        const cleanCode = code.replace(/-/g, "");
        return /^[A-Z0-9]{12}$/.test(cleanCode);
    }
    normalizeCode(code) {
        return code.replace(/-/g, "").toUpperCase();
    }
    generateShareableUrl(code, baseUrl) {
        const base = baseUrl || process.env.FRONTEND_URL || "https://whisper.app";
        return `${base}/join/${code}`;
    }
    generateQRCodeData(code) {
        const url = this.generateShareableUrl(code);
        return url;
    }
};
exports.CodeGeneratorService = CodeGeneratorService;
exports.CodeGeneratorService = CodeGeneratorService = __decorate([
    (0, common_1.Injectable)()
], CodeGeneratorService);
//# sourceMappingURL=code-generator.service.js.map