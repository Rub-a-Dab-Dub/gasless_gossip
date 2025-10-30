import { Injectable, Logger } from '@nestjs/common';
import { StarknetService } from './starknet.service';
import { EvmService } from './evm.service';
import { TipUserDto } from './dto/tip-user.dto';
import { PayRoomEntryDto } from './dto/pay-room-entry.dto';
import { shortString } from 'starknet';
import { ethers } from 'ethers';

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);
  constructor(
    private starknet: StarknetService,
    private evm: EvmService,
  ) {}

  // Starknet
  async tipUserStarknet(
    recipient: string,
    amount: { low: string; high: string },
    context: string,
  ) {
    return this.starknet.tipUser(recipient, amount, context);
  }
  async getUserEvmAddress(
    chain: 'base' | 'celo',
    username: string,
  ): Promise<string | null> {
    const contract = this.evm.getContract(chain);
    let check_address: string | null = null;
    try {
      check_address = await contract.getUserOnchainAddress(username);
    } catch (error: any) {
      if (error.message?.includes('UsernameNotExist')) {
        console.warn(`Username '${username}' does not exist on-chain yet.`);
      }
    }
    return check_address;
  }

  async createUserEvm(
    chain: 'base' | 'celo',
    username: string,
  ): Promise<string | null> {
    const contract = this.evm.getContract(chain);
    const onchain_address: string | null = await this.getUserEvmAddress(
      chain,
      username,
    );

    if (onchain_address && onchain_address !== ethers.ZeroAddress) {
      return onchain_address;
    }

    const tx = await contract.createUser(username);
    const receipt = await tx.wait();

    const event = receipt.events?.find(
      (e: any) => e.event === 'UserRegistered',
    );
    if (!event || !event.args?.walletAddress) {
      const new_onchain_address = await this.getUserEvmAddress(chain, username);
      if (new_onchain_address && new_onchain_address !== ethers.ZeroAddress) {
        return new_onchain_address;
      }
    } else {
      return event.args.walletAddress;
    }
    return null;
  }

  async createUserStarknet(username: string): Promise<string> {
    try {
      const usernameFelt = shortString.encodeShortString(username);
      const txHash = await this.starknet.createUser(usernameFelt);
      this.logger.log(`Starknet tx submitted: ${txHash}`);

      // Wait for transaction
      const receipt = await this.starknet.provider.waitForTransaction(txHash, {
        retryInterval: 1000, // Poll every 1s
      });

      if (!receipt.isSuccess()) {
        throw new Error(`Transaction failed: ${receipt.value}`);
      }

      // Parse events using Contract instance (replaces extractEvents)
      const parsedEvents = this.starknet.contract.parseEvents(receipt);

      // Find UserRegistered event
      const userRegisteredEvent = parsedEvents.find(
        (event) => String(event.name) === 'UserRegistered',
      );

      if (!userRegisteredEvent) {
        throw new Error('UserRegistered event not emitted in transaction');
      }

      // Extract wallet_address from event data
      // Based on your ABI: { username: felt252 (key?), wallet_address: ContractAddress (data) }
      const walletAddress =
        userRegisteredEvent.data.wallet_address || userRegisteredEvent.data[1]; // Fallback to index if named access fails

      this.logger.log(
        `Starknet user created: ${username} → wallet: ${walletAddress}`,
      );
      return walletAddress as string;
    } catch (error) {
      this.logger.error('createUserStarknet failed', error);
      throw error;
    }
  }

  async tipUserEvm(chain: 'base' | 'celo', dto: TipUserDto) {
    return this.evm.tipUser(
      chain,
      dto.recipientUsername,
      dto.amount,
      dto.token,
      dto.senderUsername,
      dto.context,
    );
  }

  async payRoomEntryEvm(chain: 'base' | 'celo', dto: PayRoomEntryDto) {
    return this.evm.payRoomEntry(
      chain,
      dto.roomId,
      dto.roomCreator,
      dto.entryFee,
      dto.token,
      dto.username,
    );
  }

  async createUser(chain: 'starknet' | 'base' | 'celo', username: string) {
    if (chain === 'starknet') return this.starknet.createUser(username);
    return this.evm.createUser(chain, username);
  }

  async getUserAddress(chain: 'starknet' | 'base' | 'celo', username: string) {
    if (chain === 'starknet') return this.starknet.getUserAddress(username);
    return this.evm.getUserAddress(chain, username);
  }
}
