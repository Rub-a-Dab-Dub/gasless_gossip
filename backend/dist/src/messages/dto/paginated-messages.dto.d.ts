import { Message } from "../entities/message.entity";
export declare class PaginationMetaDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export declare class PaginatedMessagesDto {
    data: Message[];
    meta: PaginationMetaDto;
}
