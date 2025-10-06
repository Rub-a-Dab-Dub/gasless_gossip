"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBansReportsTables1234567890123 = exports.BansModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bans_service_1 = require("./bans.service");
const bans_controller_1 = require("./bans.controller");
const ban_entity_1 = require("./entities/ban.entity");
const report_entity_1 = require("./entities/report.entity");
const ban_check_guard_1 = require("./guards/ban-check.guard");
let BansModule = class BansModule {
};
exports.BansModule = BansModule;
exports.BansModule = BansModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ban_entity_1.Ban, report_entity_1.Report])],
        controllers: [bans_controller_1.BansController, bans_controller_1.ReportsController],
        providers: [bans_service_1.BansService, ban_check_guard_1.BanCheckGuard],
        exports: [bans_service_1.BansService, ban_check_guard_1.BanCheckGuard],
    })
], BansModule);
const typeorm_2 = require("typeorm");
class CreateBansReportsTables1234567890123 {
    name = 'CreateBansReportsTables1234567890123';
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_2.Table({
            name: 'bans',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'reason',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'bannedBy',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'expiresAt',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'isActive',
                    type: 'boolean',
                    default: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createTable(new typeorm_2.Table({
            name: 'reports',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'reporterId',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'reportedUserId',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: [
                        'harassment',
                        'spam',
                        'inappropriate_content',
                        'hate_speech',
                        'scam',
                        'other',
                    ],
                    isNullable: false,
                },
                {
                    name: 'reason',
                    type: 'text',
                    isNullable: false,
                },
                {
                    name: 'evidence',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
                    default: "'pending'",
                },
                {
                    name: 'reviewedBy',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'reviewNotes',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'createdAt',
                    type: '',
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('reports', true);
        await queryRunner.dropTable('bans', true);
    }
}
exports.CreateBansReportsTables1234567890123 = CreateBansReportsTables1234567890123;
//# sourceMappingURL=bans.module.js.map