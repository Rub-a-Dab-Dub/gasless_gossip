export declare class DateRangeQuery {
    startDate: string;
    endDate: string;
}
export declare class TopUsersQuery extends DateRangeQuery {
    limit?: number;
}
export declare class ComparePeriodsQuery {
    period1Start: string;
    period1End: string;
    period2Start: string;
    period2End: string;
}
