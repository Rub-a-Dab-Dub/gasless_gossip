import { type OnGatewayConnection, type OnGatewayDisconnect } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { LevelUpEvent } from '../events/level-up.event';
import type { XpGainedEvent } from '../events/xp-gained.event';
import type { BadgeUnlockedEvent } from '../events/badge-unlocked.event';
export declare class LevelsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinUserRoom(client: Socket, data: {
        userId: string;
    }): void;
    handleLevelUpEvent(event: LevelUpEvent): void;
    handleXpGainedEvent(event: XpGainedEvent): void;
    handleBadgeUnlockedEvent(event: BadgeUnlockedEvent): void;
    handleGetLevelStatus(client: Socket, data: {
        userId: string;
    }): Promise<void>;
}
