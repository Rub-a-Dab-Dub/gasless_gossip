import { SecretsService } from './secrets.service';
import { CreateSecretDto } from './dto/create-secret.dto';
import { SecretResponseDto } from './dto/secret-response.dto';
export declare class SecretsController {
    private readonly secretsService;
    constructor(secretsService: SecretsService);
    createSecret(createSecretDto: CreateSecretDto): Promise<SecretResponseDto>;
    getTopSecrets(roomId: string, limit?: number): Promise<SecretResponseDto[]>;
    reactToSecret(id: string): Promise<SecretResponseDto>;
}
