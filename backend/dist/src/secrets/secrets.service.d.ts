import { Repository } from 'typeorm';
import { Secret } from './entities/secret.entity';
import { CreateSecretDto } from './dto/create-secret.dto';
import { SecretResponseDto } from './dto/secret-response.dto';
export declare class SecretsService {
    private secretsRepository;
    constructor(secretsRepository: Repository<Secret>);
    createSecret(createSecretDto: CreateSecretDto): Promise<SecretResponseDto>;
    getTopSecrets(roomId: string, limit?: number): Promise<SecretResponseDto[]>;
    incrementReaction(secretId: string): Promise<SecretResponseDto>;
    private toResponseDto;
}
