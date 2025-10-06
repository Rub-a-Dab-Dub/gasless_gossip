"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async;
getUserProgress(userId, string, questId, string);
Promise < UserQuestProgress > {
    let, progress = await this.progressRepository.findOne({
        where: { userId, questId },
        relations: ['quest']
    }),
    if(, progress) {
        const quest = await this.findOne(questId);
        progress = this.progressRepository.create({
            userId,
            questId,
            targetCount: quest.targetCount,
            lastResetAt: new Date(),
            activeMultiplier: 1.0
        });
        await this.progressRepository.save(progress);
    },
    return: progress
};
async;
incrementProgress(userId, string, questId, string, amount, number = 1);
Promise < UserQuestProgress > {
    const: progress = await this.getUserProgress(userId, questId),
    const: quest = await this.findOne(questId),
    if(quest) { }, : .status !== QuestStatus.ACTIVE
};
{
    throw new BadRequestException('Quest is not active');
}
if (progress.completed) {
    throw new BadRequestException('Quest already completed for this period');
}
progress.currentProgress += amount;
if (progress.currentProgress >= progress.targetCount) {
    await this.completeQuest(progress, quest);
}
else {
    await this.progressRepository.save(progress);
}
return progress;
async;
completeQuest(progress, UserQuestProgress, quest, Quest);
Promise < void  > {
    const: now = new Date(),
    const: today = now.toISOString().split('T')[0],
    if(quest) { }, : .supportsStreak
};
{
    const lastDate = progress.lastCompletionDate?.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (lastDate === yesterdayStr) {
        progress.currentStreak += 1;
    }
    else if (lastDate !== today) {
        progress.currentStreak = 1;
    }
    progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
    progress.lastCompletionDate = now;
}
const activeFrenzy = await this.getActiveFrenzy(quest.id);
if (activeFrenzy && quest.allowsFrenzyBoost) {
    progress.activeMultiplier = activeFrenzy.multiplier;
}
const baseXp = quest.rewardAmount;
const streakBonus = quest.supportsStreak ? (progress.currentStreak - 1) * quest.streakBonusXp : 0;
const totalXp = Math.floor((baseXp + streakBonus) * progress.activeMultiplier);
const tokens = Math.floor(quest.bonusTokens * progress.activeMultiplier);
progress.completed = true;
progress.completedAt = now;
await this.progressRepository.save(progress);
await this.auditRepository.save({
    userId: progress.userId,
    questId: quest.id,
    progressId: progress.id,
    progressSnapshot: progress.currentProgress,
    streakSnapshot: progress.currentStreak,
    multiplierApplied: progress.activeMultiplier,
    xpAwarded: totalXp,
    tokensAwarded: tokens,
    metadata: {
        questTitle: quest.title,
        completionDate: today
    }
});
//# sourceMappingURL=progres_tracking.js.map