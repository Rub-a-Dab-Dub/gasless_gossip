import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ChainListenerService implements OnModuleInit {
    private readonly logger = new Logger(ChainListenerService.name);
    private providers: Map<string, ethers.providers.WebSocketProvider> = new Map();
    private reconnectAttempts: Map<string, number> = new Map();
    private readonly MAX_RECONNECT_ATTEMPTS = 5;

    constructor(
        @InjectQueue('chain-events') private eventQueue: Queue,
    ) { }

    async onModuleInit() {
        await this.initializeProviders();
    }

    private async initializeProviders() {
        // Initialize providers for different chains
        const chains = [
            { id: '1', rpc: process.env.ETH_MAINNET_WS },
            { id: '137', rpc: process.env.POLYGON_MAINNET_WS },
            { id: '56', rpc: process.env.BSC_MAINNET_WS },
        ];

        for (const chain of chains) {
            if (chain.rpc) {
                await this.connectProvider(chain.id, chain.rpc);
            }
        }
    }

    private async connectProvider(chainId: string, rpcUrl: string) {
        try {
            const provider = new ethers.providers.WebSocketProvider(rpcUrl);

            provider.on('error', (error) => {
                this.logger.error(`Provider error for chain ${chainId}:`, error);
                this.handleReconnect(chainId, rpcUrl);
            });

            provider.on('disconnect', () => {
                this.logger.warn(`Provider disconnected for chain ${chainId}`);
                this.handleReconnect(chainId, rpcUrl);
            });

            // Listen to new blocks
            provider.on('block', async (blockNumber) => {
                await this.handleNewBlock(chainId, blockNumber);
            });

            this.providers.set(chainId, provider);
            this.reconnectAttempts.set(chainId, 0);
            this.logger.log(`Connected to chain ${chainId}`);
        } catch (error) {
            this.logger.error(`Failed to connect to chain ${chainId}:`, error);
            this.handleReconnect(chainId, rpcUrl);
        }
    }

    private async handleReconnect(chainId: string, rpcUrl: string) {
        const attempts = this.reconnectAttempts.get(chainId) || 0;

        if (attempts >= this.MAX_RECONNECT_ATTEMPTS) {
            this.logger.error(`Max reconnect attempts reached for chain ${chainId}`);
            return;
        }

        this.reconnectAttempts.set(chainId, attempts + 1);
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);

        this.logger.log(`Reconnecting to chain ${chainId} in ${delay}ms (attempt ${attempts + 1})`);

        setTimeout(() => {
            this.connectProvider(chainId, rpcUrl);
        }, delay);
    }

    private async handleNewBlock(chainId: string, blockNumber: number) {
        await this.eventQueue.add('process-block', {
            chainId,
            blockNumber,
            timestamp: Date.now(),
        }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
        });
    }

    async watchAddress(chainId: string, address: string) {
        const provider = this.providers.get(chainId);
        if (!provider) {
            throw new Error(`No provider for chain ${chainId}`);
        }

        const filter = {
            address,
            topics: [],
        };

        provider.on(filter, async (log) => {
            await this.eventQueue.add('process-log', {
                chainId,
                log,
                timestamp: Date.now(),
            });
        });
    }

    async watchTransaction(chainId: string, txHash: string) {
        const provider = this.providers.get(chainId);
        if (!provider) {
            throw new Error(`No provider for chain ${chainId}`);
        }

        const receipt = await provider.waitForTransaction(txHash);

        await this.eventQueue.add('tx-confirmed', {
            chainId,
            txHash,
            receipt,
            timestamp: Date.now(),
        });
    }
}