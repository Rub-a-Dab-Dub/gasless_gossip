import { CreatePodcastRoomDto } from './create-podcast-room.dto';
declare const UpdatePodcastRoomDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreatePodcastRoomDto, "roomId" | "audioHash" | "creatorId">>>;
export declare class UpdatePodcastRoomDto extends UpdatePodcastRoomDto_base {
}
export declare class PodcastRoomResponseDto {
    id: string;
    roomId: string;
    audioHash: string;
    creatorId: string;
    title: string;
    description: string;
    duration: number;
    audioFormat: string;
    fileSize: number;
    stellarHash: string;
    ipfsHash: string;
    isActive: boolean;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export {};
