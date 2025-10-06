async getUserStreaks(userId: string): Promise<any[]> {
    const progresses = await this.progressRepository.find({
      where: { userId },
      relations: ['quest']
    });

    return progresses
      .filter(p => p.quest.supportsStreak && p.currentStreak > 0)
      .map(p => ({
        questId: p.questId,
        questTitle: p.quest.title,
        currentStreak: p.currentStreak,
        longestStreak: p.longestStreak,
        lastCompletionDate: p.lastCompletionDate
      }));
  }