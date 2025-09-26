import type { Visit } from "../entities/visit.entity"

export class VisitCreatedEvent {
  constructor(public readonly visit: Visit) {}
}
