export declare class PredictionDto {
    id: string;
    title: string;
    description?: string;
}
export declare class CreatePumpRoomDto {
    roomId: string;
    predictions: PredictionDto[];
    endDate?: string;
}
