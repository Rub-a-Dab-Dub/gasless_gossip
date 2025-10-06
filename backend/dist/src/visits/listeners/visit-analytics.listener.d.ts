import type { VisitCreatedEvent } from "../events/visit-created.event";
export declare class VisitAnalyticsListener {
    private readonly logger;
    handleVisitCreated(event: VisitCreatedEvent): Promise<void>;
    handleVisitUpdated(event: VisitCreatedEvent): Promise<void>;
    private trackRoomPopularity;
    private trackUserEngagement;
}
