import type { Server, Socket } from "socket.io";
import type { DauMetricsService } from "./dau-metrics.service";
import type { TrackFeatureUsageDto } from "./dto/track-feature-usage.dto";
export declare class DauMetricsGateway {
    private readonly dauMetricsService;
    server: Server;
    constructor(dauMetricsService: DauMetricsService);
    handleTrackUsage(data: TrackFeatureUsageDto, client: Socket): {
        success: boolean;
        data: Promise<import("./entities/feature-usage.entity").FeatureUsage>;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    };
    handleSubscribeDau(data: {
        featureName?: string;
    }, client: Socket): {
        success: boolean;
        message: string;
    };
    handleUnsubscribeDau(data: {
        featureName?: string;
    }, client: Socket): {
        success: boolean;
        message: string;
    };
    broadcastDauUpdate(featureName: string, data: any): void;
    broadcastAlert(alert: any): void;
}
