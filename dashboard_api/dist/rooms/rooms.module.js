"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const rooms_controller_1 = require("./rooms.controller");
const rooms_service_1 = require("./services/rooms.service");
const room_expiry_service_1 = require("./services/room-expiry.service");
const room_export_service_1 = require("./services/room-export.service");
const room_expiry_processor_1 = require("./processors/room-expiry.processor");
const room_events_gateway_1 = require("./events/room-events.gateway");
const moderator_guard_1 = require("./guards/moderator.guard");
const secret_rooms_controller_1 = require("./controllers/secret-rooms.controller");
const fake_name_generator_service_1 = require("./services/fake-name-generator.service");
const voice_moderation_queue_service_1 = require("./services/voice-moderation-queue.service");
const room_scheduler_service_1 = require("./services/room-scheduler.service");
const secret_rooms_gateway_1 = require("./gateways/secret-rooms.gateway");
const room_entity_1 = require("../entities/room.entity");
const participant_entity_1 = require("../entities/participant.entity");
const message_entity_1 = require("../entities/message.entity");
const transaction_entity_1 = require("../entities/transaction.entity");
let RoomsModule = class RoomsModule {
};
exports.RoomsModule = RoomsModule;
exports.RoomsModule = RoomsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([room_entity_1.Room, participant_entity_1.Participant, message_entity_1.Message, transaction_entity_1.Transaction]),
            bull_1.BullModule.registerQueue({
                name: 'room-expiry',
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
        ],
        controllers: [
            rooms_controller_1.RoomsController,
            secret_rooms_controller_1.SecretRoomsController,
        ],
        providers: [
            rooms_service_1.RoomsService,
            room_expiry_service_1.RoomExpiryService,
            room_export_service_1.RoomExportService,
            room_expiry_processor_1.RoomExpiryProcessor,
            room_events_gateway_1.RoomEventsGateway,
            moderator_guard_1.ModeratorGuard,
            fake_name_generator_service_1.FakeNameGeneratorService,
            voice_moderation_queue_service_1.VoiceModerationQueueService,
            room_scheduler_service_1.RoomSchedulerService,
            secret_rooms_gateway_1.SecretRoomsGateway,
        ],
        exports: [
            rooms_service_1.RoomsService,
            fake_name_generator_service_1.FakeNameGeneratorService,
            voice_moderation_queue_service_1.VoiceModerationQueueService,
            room_scheduler_service_1.RoomSchedulerService,
        ],
    })
], RoomsModule);
//# sourceMappingURL=rooms.module.js.map