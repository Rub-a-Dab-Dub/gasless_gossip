import { Injectable, OnModuleInit } from '@nestjs/common';
import { EvmService } from '../contracts/evm.service';

@Injectable()
export class EventListenerService implements OnModuleInit {
  constructor(private evm: EvmService) {}

  onModuleInit() {
    ['base', 'celo'].forEach((chain) => {
      const contract = (this.evm as any).contracts[chain];
      contract.on(
        'TipSent',
        (sender, recipient, amount, platformFee, netAmount, context, ts) => {
          console.log(
            `[${chain}] Tip: ${sender} → ${recipient} | ${amount} | ctx: ${context}`,
          );
        },
      );
    });
  }
}
