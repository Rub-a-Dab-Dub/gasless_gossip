export declare class VisitResponseDto {
    id: string;
    roomId: string;
    userId: string;
    createdAt: Date;
    duration: number;
    user?: {
        id: string;
        username: string;
        pseudonym?: string;
    };
}
