export declare class SearchRoomsByTagDto {
    tag: string;
    limit?: number;
    offset?: number;
}
export declare class SearchRoomsByMultipleTagsDto {
    tags: string[];
    limit?: number;
    offset?: number;
    operator?: 'AND' | 'OR';
}
