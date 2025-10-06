import type { LevelUpEvent } from '../events/level-up.event';
export declare class LevelUpListener {
    private readonly logger;
    handleLevelUpEvent(event: LevelUpEvent): Promise<void>;
}
