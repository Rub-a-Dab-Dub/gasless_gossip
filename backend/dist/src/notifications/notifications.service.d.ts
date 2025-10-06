import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationsService {
    private readonly notificationRepo;
    constructor(notificationRepo: Repository<Notification>);
    create(dto: CreateNotificationDto): Promise<Notification>;
    findByUser(userId: string): Promise<Notification[]>;
}
