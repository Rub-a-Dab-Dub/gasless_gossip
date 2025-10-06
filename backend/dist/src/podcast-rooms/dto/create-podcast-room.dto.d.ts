export declare class CreatePodcastRoomDto {
    roomId: string;
    audioHash: string;
    creatorId: string;
    title: string;
    description?: string;
    duration?: number;
    audioFormat?: string;
    fileSize?: number;
    tags?: string[];
}
