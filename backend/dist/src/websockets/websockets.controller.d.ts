import { WebSocketsService } from './websockets.service';
export declare class WebSocketsController {
    private readonly wsService;
    constructor(wsService: WebSocketsService);
    getStatus(): {
        status: string;
    };
}
