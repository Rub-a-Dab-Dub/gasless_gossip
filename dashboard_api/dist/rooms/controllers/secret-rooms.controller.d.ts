import { RoomsService } from './services/rooms.service';
import { FakeNameGeneratorService } from './services/fake-name-generator.service';
import { VoiceModerationQueueService } from './services/voice-moderation-queue.service';
import { RoomSchedulerService } from './services/room-scheduler.service';
import { SecretRoomsGateway } from './gateways/secret-rooms.gateway';
import { CreateSecretRoomDto, UpdateSecretRoomDto, JoinRoomDto, InviteUserDto, SendTokenTipDto, RoomReactionDto, VoiceNoteDto, ModerationActionDto, SecretRoomResponseDto, RoomStatsDto, ModerationQueueStatusDto, FakeNamePreviewDto } from '../dto/secret-room.dto';
export declare class SecretRoomsController {
    private readonly roomsService;
    private readonly fakeNameGenerator;
    private readonly voiceModerationQueue;
    private readonly roomScheduler;
    private readonly secretRoomsGateway;
    constructor(roomsService: RoomsService, fakeNameGenerator: FakeNameGeneratorService, voiceModerationQueue: VoiceModerationQueueService, roomScheduler: RoomSchedulerService, secretRoomsGateway: SecretRoomsGateway);
    createSecretRoom(dto: CreateSecretRoomDto, req: any): Promise<SecretRoomResponseDto>;
    getSecretRoom(id: string, req: any): Promise<SecretRoomResponseDto>;
    updateSecretRoom(id: string, dto: UpdateSecretRoomDto, req: any): Promise<SecretRoomResponseDto>;
    deleteSecretRoom(id: string, req: any): Promise<void>;
    joinSecretRoom(id: string, dto: JoinRoomDto, req: any): Promise<SecretRoomResponseDto>;
    leaveSecretRoom(id: string, req: any): Promise<void>;
    inviteUser(id: string, dto: InviteUserDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendTokenTip(id: string, dto: SendTokenTipDto, req: any): Promise<{
        success: boolean;
        transactionId: string;
    }>;
    addReaction(id: string, dto: RoomReactionDto, req: any): Promise<{
        success: boolean;
    }>;
    submitVoiceNote(id: string, dto: VoiceNoteDto, req: any): Promise<{
        queuePosition: number;
        estimatedWaitTime: number;
    }>;
    getRoomReactions(id: string, req: any): Promise<any>;
    moderateRoom(id: string, dto: ModerationActionDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getRoomStats(id: string, req: any): Promise<RoomStatsDto>;
    getModerationQueueStatus(id: string, req: any): Promise<ModerationQueueStatusDto>;
    previewFakeNames(theme: string): Promise<FakeNamePreviewDto>;
    getFakeNameThemes(): Promise<{
        themes: string[];
    }>;
    getSchedulerStats(req: any): Promise<any>;
    manualCleanup(req: any): Promise<any>;
}
