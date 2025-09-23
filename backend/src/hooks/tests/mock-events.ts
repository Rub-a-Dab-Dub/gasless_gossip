import { EventType } from '../entities/hook.entity';
import { CreateHookDto, StellarEventDto } from '../dto/hook.dto';

export class MockEventGenerator {
  static generateXpUpdateEvent(): StellarEventDto {
    return {
      transactionId: `xp_tx_${Date.now()}`,
      accountId: 'GDSAMPLE12345ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
      eventType: EventType.XP_UPDATE,
      eventData: {
        userId: 'user_123',
        xpAmount: Math.floor(Math.random() * 1000) + 10,
        reason: 'completed_mission',
        missionId: 'mission_456',
        timestamp: new Date().toISOString(),
      },
    };
  }

  static generateTokenSendEvent(): StellarEventDto {
    return {
      transactionId: `send_tx_${Date.now()}`,
      accountId: 'GDSENDER12345ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
      eventType: EventType.TOKEN_SEND,
      eventData: {
        fromAccount: 'GDSENDER12345ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        toAccount: 'GDRECEIVER123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        amount: (Math.random() * 1000).toFixed(7),
        assetCode: 'WHSPR',
        assetIssuer: 'GDISSUER12345ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        memo: 'Payment for services',
        timestamp: new Date().toISOString(),
      },
    };
  }

  static generateTokenReceiveEvent(): StellarEventDto {
    return {
      transactionId: `recv_tx_${Date.now()}`,
      accountId: 'GDRECEIVER123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
      eventType: EventType.TOKEN_RECEIVE,
      eventData: {
        account: 'GDRECEIVER123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        fromAccount: 'GDSENDER12345ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        amount: (Math.random() * 1000).toFixed(7),
        assetCode: 'WHSPR',
        assetIssuer: 'GDISSUER12345ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        memo: 'Reward payment',
        timestamp: new Date().toISOString(),
      },
    };
  }

  static generateContractCallEvent(): StellarEventDto {
    return {
      transactionId: `contract_tx_${Date.now()}`,
      accountId: 'GDCALLER1234ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
      eventType: EventType.CONTRACT_CALL,
      eventData: {
        contractId: 'CDCONTRACT123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        functionName: 'update_user_score',
        parameters: {
          user_id: 'user_789',
          new_score: Math.floor(Math.random() * 10000),
          category: 'gaming',
        },
        callerAccount: 'GDCALLER1234ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        timestamp: new Date().toISOString(),
      },
      contractId: 'CDCONTRACT123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
    };
  }

  static generateAccountCreatedEvent(): StellarEventDto {
    return {
      transactionId: `create_tx_${Date.now()}`,
      accountId: 'GDNEWUSER123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
      eventType: EventType.ACCOUNT_CREATED,
      eventData: {
        accountId: 'GDNEWUSER123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        startingBalance: '1.0000000',
        creatorAccount: 'GDCREATOR123ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567',
        username: `user_${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  static generateRandomEvent(): StellarEventDto {
    const eventTypes = [
      this.generateXpUpdateEvent,
      this.generateTokenSendEvent,
      this.generateTokenReceiveEvent,
      this.generateContractCallEvent,
      this.generateAccountCreatedEvent,
    ];

    const randomIndex = Math.floor(Math.random() * eventTypes.length);
    return eventTypes[randomIndex]();
  }

  static generateBatchEvents(count: number): StellarEventDto[] {
    return Array.from({ length: count }, () => this.generateRandomEvent());
  }
}