export interface XpThresholdConfig {
  level: number
  xpRequired: number
  badgeUnlocked?: string
}

export const DEFAULT_XP_THRESHOLDS: XpThresholdConfig[] = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000, badgeUnlocked: "bronze_achiever" },
  { level: 6, xpRequired: 1750 },
  { level: 7, xpRequired: 2750 },
  { level: 8, xpRequired: 4000 },
  { level: 9, xpRequired: 5500 },
  { level: 10, xpRequired: 7500, badgeUnlocked: "silver_achiever" },
  { level: 11, xpRequired: 10000 },
  { level: 12, xpRequired: 13000 },
  { level: 13, xpRequired: 16500 },
  { level: 14, xpRequired: 20500 },
  { level: 15, xpRequired: 25000, badgeUnlocked: "gold_achiever" },
  { level: 16, xpRequired: 30000 },
  { level: 17, xpRequired: 36000 },
  { level: 18, xpRequired: 43000 },
  { level: 19, xpRequired: 51000 },
  { level: 20, xpRequired: 60000, badgeUnlocked: "platinum_achiever" },
]

export class XpThresholdsConfig {
  static getThresholdForLevel(level: number): number {
    const threshold = DEFAULT_XP_THRESHOLDS.find((t) => t.level === level)
    return threshold?.xpRequired ?? 0
  }

  static getNextLevelThreshold(currentLevel: number): number {
    const nextLevel = currentLevel + 1
    return this.getThresholdForLevel(nextLevel)
  }

  static getLevelForXp(totalXp: number): number {
    let level = 1
    for (const threshold of DEFAULT_XP_THRESHOLDS) {
      if (totalXp >= threshold.xpRequired) {
        level = threshold.level
      } else {
        break
      }
    }
    return level
  }

  static getBadgeForLevel(level: number): string | undefined {
    const threshold = DEFAULT_XP_THRESHOLDS.find((t) => t.level === level)
    return threshold?.badgeUnlocked
  }

  static getAllThresholds(): XpThresholdConfig[] {
    return DEFAULT_XP_THRESHOLDS
  }
}
