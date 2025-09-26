import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HookRepository } from '../repositories/hook.repository';
import { HooksGateway } from '../gateways/hooks.gateway';
import { Hook, EventType } from '../entities/hook.entity';
import { CreateHookDto, StellarEventDto, HookResponseDto } from '../dto/hook.dto';
import { StellarService } from './stellar.service';

@Injectable()
export class HooksService {
  private readonly logger = new Logger(HooksService.name);

  constructor(
    private readonly hookRepository: HookRepository,
    private readonly hooksGateway: HooksGateway,
    private readonly stellarService: StellarService,
  ) {}

  async createHook(createHookDto: CreateHookDto): Promise<HookResponseDto> {
    try {
      // Check for duplicate transactions
      if (createHookDto.stellarTransactionId) {
        const existingHook = await this.hookRepository.findByTransactionId(
          createHookDto.stellarTransactionId
        );
        if (existingHook) {
          this.logger.warn(`Duplicate transaction ID: ${createHookDto.stellarTransactionId}`);
          return this.mapToResponseDto(existingHook);
        }
      }

      const hook = await this.hookRepository.create(createHookDto);
      
      // Broadcast the new hook via WebSocket
      this.hooksGateway.broadcastHookCreated(hook);
      
      // Process the hook asynchronously
      this.processHookAsync(hook.id);
      
      this.logger.log(`Hook created successfully: ${hook.id}`);
      return this.mapToResponseDto(hook);
    } catch (error) {
      this.logger.error(`Failed to create hook: ${error.message}`);
      throw error;
    }
  }

  async processStellarEvent(stellarEventDto: StellarEventDto): Promise<HookResponseDto> {
    try {
      // Validate Stellar transaction
      const isValidTransaction = await this.stellarService.validateTransaction(
        stellarEventDto.transactionId
      );

      if (!isValidTransaction) {
        throw new Error(`Invalid Stellar transaction: ${stellarEventDto.transactionId}`);
      }

      const createHookDto: CreateHookDto = {
        eventType: stellarEventDto.eventType,
        data: stellarEventDto.eventData,
        stellarTransactionId: stellarEventDto.transactionId,
        stellarAccountId: stellarEventDto.accountId,
      };

      return await this.createHook(createHookDto);
    } catch (error) {
      this.logger.error(`Failed to process Stellar event: ${error.message}`);
      throw error;
    }
  }

  async getHookById(id: string): Promise<HookResponseDto> {
    const hook = await this.hookRepository.findById(id);
    if (!hook) {
      throw new NotFoundException(`Hook with ID ${id} not found`);
    }
    return this.mapToResponseDto(hook);
  }

  async getRecentHooks(limit = 50): Promise<HookResponseDto[]> {
    const hooks = await this.hookRepository.findRecent(limit);
    return hooks.map(hook => this.mapToResponseDto(hook));
  }

  async getHooksByEventType(eventType: EventType, limit = 100): Promise<HookResponseDto[]> {
    const hooks = await this.hookRepository.findByEventType(eventType, limit);
    return hooks.map(hook => this.mapToResponseDto(hook));
  }

  async processUnprocessedHooks(): Promise<void> {
    try {
      const unprocessedHooks = await this.hookRepository.findUnprocessed();
      this.logger.log(`Processing ${unprocessedHooks.length} unprocessed hooks`);

      for (const hook of unprocessedHooks) {
        await this.processHookAsync(hook.id);
      }
    } catch (error) {
      this.logger.error(`Failed to process unprocessed hooks: ${error.message}`);
    }
  }

  private async processHookAsync(hookId: string): Promise<void> {
    try {
      const hook = await this.hookRepository.findById(hookId);
      if (!hook || hook.processed) {
        return;
      }

      // Process based on event type
      let processResult: any;
      switch (hook.eventType) {
        case EventType.XP_UPDATE:
          processResult = await this.processXpUpdate(hook);
          break;
        case EventType.TOKEN_SEND:
          processResult = await this.processTokenSend(hook);
          break;
        case EventType.TOKEN_RECEIVE:
          processResult = await this.processTokenReceive(hook);
          break;
        case EventType.CONTRACT_CALL:
          processResult = await this.processContractCall(hook);
          break;
        case EventType.ACCOUNT_CREATED:
          processResult = await this.processAccountCreated(hook);
          break;
        default:
          throw new Error(`Unknown event type: ${hook.eventType}`);
      }

      // Mark as processed
      await this.hookRepository.markAsProcessed(hook.id);
      
      // Get updated hook and broadcast
      const updatedHook = await this.hookRepository.findById(hookId);
      if (updatedHook) {
        this.hooksGateway.broadcastHookProcessed(updatedHook);
      }

      this.logger.log(`Hook processed successfully: ${hookId}`);
    } catch (error) {
      this.logger.error(`Failed to process hook ${hookId}: ${error.message}`);
      await this.hookRepository.markAsProcessed(hookId, error.message);
    }
  }

  private async processXpUpdate(hook: Hook): Promise<any> {
    // Implement XP update logic
    const { userId, xpAmount, reason } = hook.data;
    this.logger.log(`Processing XP update: User ${userId}, Amount: ${xpAmount}`);
    
    // Here you would update user XP in your database
    // Example: await this.userService.updateXp(userId, xpAmount, reason);
    
    return { success: true, updatedXp: xpAmount };
  }

  private async processTokenSend(hook: Hook): Promise<any> {
    // Implement token send logic
    const { fromAccount, toAccount, amount, assetCode } = hook.data;
    this.logger.log(`Processing token send: ${amount} ${assetCode} from ${fromAccount} to ${toAccount}`);
    
    // Here you would update account balances, transaction history, etc.
    
    return { success: true, transactionProcessed: true };
  }

  private async processTokenReceive(hook: Hook): Promise<any> {
    // Implement token receive logic
    const { account, amount, assetCode, fromAccount } = hook.data;
    this.logger.log(`Processing token receive: ${account} received ${amount} ${assetCode} from ${fromAccount}`);
    
    return { success: true, received: true };
  }

  private async processContractCall(hook: Hook): Promise<any> {
    // Implement contract call logic
    const { contractId, functionName, parameters } = hook.data;
    this.logger.log(`Processing contract call: ${contractId}.${functionName}`);
    
    return { success: true, contractExecuted: true };
  }

  private async processAccountCreated(hook: Hook): Promise<any> {
    // Implement account creation logic
    const { accountId, startingBalance } = hook.data;
    this.logger.log(`Processing account created: ${accountId} with balance ${startingBalance}`);
    
    return { success: true, accountRegistered: true };
  }

  private mapToResponseDto(hook: Hook): HookResponseDto {
    return {
      id: hook.id,
      eventType: hook.eventType,
      data: hook.data,
      stellarTransactionId: hook.stellarTransactionId,
      stellarAccountId: hook.stellarAccountId,
      processed: hook.processed,
      createdAt: hook.createdAt,
      processedAt: hook.processedAt,
      errorMessage: hook.errorMessage,
    };
  }

  async getHookStats(): Promise<any> {
    // This would typically use raw queries for better performance
    const stats = {
      totalHooks: await this.hookRepository.findRecent(1000).then(hooks => hooks.length),
      processedHooks: await this.hookRepository.findRecent(1000).then(hooks => 
        hooks.filter(h => h.processed).length
      ),
      connectedClients: this.hooksGateway.getConnectedClientsCount(),
      eventTypeDistribution: {
        xp_update: 0,
        token_send: 0,
        token_receive: 0,
        contract_call: 0,
        account_created: 0,
      }
    };

    // Broadcast stats to connected clients
    this.hooksGateway.broadcastStats(stats);
    
    return stats;
  }
}