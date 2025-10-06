"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let LevelResponseInterceptor = class LevelResponseInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data && typeof data === 'object' && 'level' in data) {
                const levelData = data;
                return {
                    ...levelData,
                    isMaxLevel: levelData.level >= 20,
                    nextLevelExists: levelData.level < 20,
                    progressText: `${levelData.currentXp}/${levelData.xpThreshold} XP (${levelData.progressPercentage}%)`,
                };
            }
            return data;
        }));
    }
};
exports.LevelResponseInterceptor = LevelResponseInterceptor;
exports.LevelResponseInterceptor = LevelResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], LevelResponseInterceptor);
//# sourceMappingURL=level-response.interceptor.js.map