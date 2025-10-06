import type { InvitationCreatedEvent } from "../events/invitation-created.event";
import type { InvitationAcceptedEvent } from "../events/invitation-accepted.event";
export declare class InvitationAnalyticsListener {
    handleInvitationCreated(event: InvitationCreatedEvent): Promise<void>;
    handleInvitationAccepted(event: InvitationAcceptedEvent): Promise<void>;
    private trackInvitationMetrics;
    private sendWelcomeNotification;
}
