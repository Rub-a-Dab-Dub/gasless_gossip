"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardType = exports.QuestStatus = exports.QuestType = void 0;
var QuestType;
(function (QuestType) {
    QuestType["DAILY"] = "DAILY";
    QuestType["WEEKLY"] = "WEEKLY";
    QuestType["SPECIAL"] = "SPECIAL";
    QuestType["ONETIME"] = "ONETIME";
})(QuestType || (exports.QuestType = QuestType = {}));
var QuestStatus;
(function (QuestStatus) {
    QuestStatus["ACTIVE"] = "ACTIVE";
    QuestStatus["INACTIVE"] = "INACTIVE";
    QuestStatus["ENDED"] = "ENDED";
    QuestStatus["DRAFT"] = "DRAFT";
})(QuestStatus || (exports.QuestStatus = QuestStatus = {}));
var RewardType;
(function (RewardType) {
    RewardType["XP"] = "XP";
    RewardType["TOKENS"] = "TOKENS";
    RewardType["BOTH"] = "BOTH";
})(RewardType || (exports.RewardType = RewardType = {}));
//# sourceMappingURL=quest.enums.js.map