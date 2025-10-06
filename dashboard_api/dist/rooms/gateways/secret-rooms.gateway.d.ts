import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FakeNameGeneratorService, FakeNameTheme } from '../services/fake-name-generator.service';
import { VoiceModerationQueueService } from '../services/voice-moderation-queue.service';
interface ConnectedUser {
    userId: string;
    roomId: string;
    pseudonym?: string;
    joinedAt: Date;
}
interface ReactionData {
    messageId: string;
    roomId: string;
    emoji: string;
    userId: string;
    pseudonym?: string;
}
interface VoiceNoteData {
    roomId: string;
    userId: string;
    voiceNoteUrl: string;
    duration: number;
    pseudonym?: string;
}
interface TokenTipData {
    roomId: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    token: string;
    message?: string;
    fromPseudonym?: string;
    toPseudonym?: string;
}
export declare class SecretRoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private fakeNameGenerator;
    private voiceModerationQueue;
    server: Server;
    private readonly logger;
    private connectedUsers;
    private roomParticipants;
    constructor(fakeNameGenerator: FakeNameGeneratorService, voiceModerationQueue: VoiceModerationQueueService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
        userId: string;
        enablePseudonym?: boolean;
        fakeNameTheme?: FakeNameTheme;
    }): Promise<void>;
    handleLeaveRoom(client: Socket): Promise<void>;
    handleReaction(client: Socket, data: ReactionData): Promise<void>;
    handleVoiceNote(client: Socket, data: VoiceNoteData): Promise<void>;
    handleTokenTip(client: Socket, data: TokenTipData): Promise<void>;
    handleGetRoomStats(client: Socket, data: {
        roomId: string;
    }): Promise<void>;
    broadcastToRoom(roomId: string, event: string, data: any): void;
    getRoomParticipantCount(roomId: string): number;
    getRoomParticipants(roomId: string): ConnectedUser[];
}
export {};
