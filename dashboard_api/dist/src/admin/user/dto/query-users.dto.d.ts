export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare enum SortField {
    USERNAME = "username",
    EMAIL = "email",
    LEVEL = "level",
    XP = "xp",
    CREATED_AT = "createdAt",
    LAST_ACTIVITY = "lastActivityAt"
}
export declare class QueryUsersDto {
    page?: number;
    limit?: number;
    search?: string;
    username?: string;
    email?: string;
    level?: number;
    minXp?: number;
    maxXp?: number;
    lastActivityAfter?: string;
    walletAddress?: string;
    isVerified?: boolean;
    isSuspended?: boolean;
    sortBy?: SortField;
    sortOrder?: SortOrder;
}
