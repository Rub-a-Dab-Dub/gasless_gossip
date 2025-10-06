import { Repository } from 'typeorm';
import { Reputation } from './entities/reputation.entity';
import { UpdateReputationDto } from './dto/update-reputation.dto';
import { Tip } from '../tips/entities/tip.entity';
import { Message } from '../messages/message.entity';
export declare class ReputationService {
    private readonly reputationRepository;
    private readonly tipRepository;
    private readonly messageRepository;
    constructor(reputationRepository: Repository<Reputation>, tipRepository: Repository<Tip>, messageRepository: Repository<Message>);
    getReputation(userId: number): Promise<Reputation | null>;
    updateReputation(dto: UpdateReputationDto): Promise<Reputation>;
    calculateReputationFromActions(userId: number): Promise<Reputation>;
}
