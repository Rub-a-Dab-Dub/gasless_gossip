import type { Visit } from "../entities/visit.entity";
export declare class VisitCreatedEvent {
    readonly visit: Visit;
    constructor(visit: Visit);
}
