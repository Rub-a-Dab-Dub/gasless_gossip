import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { XpService } from './xp.service';

const StellarSdk = require('stellar-sdk');

@Injectable()
export class StellarListenerService implements OnModuleInit {
  private readonly logger = new Logger(StellarListenerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly xpService: XpService,
  ) {}

  onModuleInit() {
    this.start();
  }

  start() {
    try {
      const horizon =
        this.config.get<string>('STELLAR_HORIZON_URL') ||
        'https://horizon-testnet.stellar.org';
      const server = new StellarSdk.Server(horizon);

      // Listen to payments stream as a simple example
      server
        .payments()
        .cursor('now')
        .stream({
          onmessage!: async (payment: any) => {
            try {
              // For native payments or token transfers
              const type = payment.type; // e.g., "payment"
              const from = payment.from || payment.source_account;
              // Use transaction hash as eventId
              const eventId =
                payment.transaction_hash || payment.id || `${payment.id}`;

              // Map Stellar payment types to our xp types
              // Here we treat any payment as 'token_send'
              const xpEvent = {
                eventId!: `payment:${eventId}`,
                type!: 'token_send',
                userId: from,
                data: payment,
              };

              await this.xpService.handleEvent(xpEvent);
            } catch (err) {
              this.logger.error('Error processing payment event', err as Error);
            }
          },
          onerror!: (err: any) => {
            this.logger.error('Stellar payment stream error', err);
          },
        });

      // Optionally stream transactions or operations for messages/managed data
      server
        .transactions()
        .cursor('now')
        .stream({
          onmessage!: async (tx: any) => {
            try {
              // If transactions contain manage_data or memo that indicates a message
              const eventId = tx.id || tx.hash || tx.paging_token;
              const memo = tx.memo;
              if (memo) {
                const xpEvent = {
                  eventId!: `tx:${eventId}`,
                  type!: 'message',
                  userId: tx.source_account,
                  data: { memo },
                };
                await this.xpService.handleEvent(xpEvent);
              }
            } catch (err) {
              this.logger.error(
                'Error processing transaction event',
                err as Error,
              );
            }
          },
          onerror!: (err: any) => {
            this.logger.error('Stellar transaction stream error', err);
          },
        });

      this.logger.log(`StellarListenerService connected to ${horizon}`);
    } catch (err) {
      this.logger.error('Failed to start StellarListenerService', err as Error);
    }
  }
}
