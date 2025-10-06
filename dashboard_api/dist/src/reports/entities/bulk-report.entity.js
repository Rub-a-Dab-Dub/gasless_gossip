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
exports.BulkReport = exports.ReportFormat = exports.ReportStatus = void 0;
const typeorm_1 = require("typeorm");
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["PROCESSING"] = "processing";
    ReportStatus["COMPLETED"] = "completed";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["JSON"] = "json";
    ReportFormat["CSV"] = "csv";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
let BulkReport = class BulkReport {
    id;
    adminId;
    resources;
    filters;
    format;
    status;
    progress;
    fileSizeBytes;
    downloadUrl;
    errorMessage;
    createdAt;
    updatedAt;
};
exports.BulkReport = BulkReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BulkReport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BulkReport.prototype, "adminId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array' }),
    __metadata("design:type", Array)
], BulkReport.prototype, "resources", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], BulkReport.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportFormat, default: ReportFormat.JSON }),
    __metadata("design:type", String)
], BulkReport.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING }),
    __metadata("design:type", String)
], BulkReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BulkReport.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], BulkReport.prototype, "fileSizeBytes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BulkReport.prototype, "downloadUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BulkReport.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BulkReport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], BulkReport.prototype, "updatedAt", void 0);
exports.BulkReport = BulkReport = __decorate([
    (0, typeorm_1.Entity)('bulk_reports')
], BulkReport);
//# sourceMappingURL=bulk-report.entity.js.map