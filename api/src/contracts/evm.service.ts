import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { EVM_ABI } from './abis/evm-abi';

type Chain = 'base' | 'celo';

@Injectable()
export class EvmService {
  private readonly logger = new Logger(EvmService.name);
  private providers: Record<Chain, ethers.Provider>;
  private wallets: Record<Chain, ethers.Wallet>;
  private contracts: Record<Chain, ethers.Contract>;

  private abi = EVM_ABI;

  constructor(private configService: ConfigService) {
    this.providers = {
      base: new ethers.JsonRpcProvider(
        this.configService.get<string>('BASE_RPC_URL'),
      ),
      celo: new ethers.JsonRpcProvider(
        this.configService.get<string>('CELO_RPC_URL'),
      ),
    };
    const basePrivateKey = this.configService.get<string>('BASE_PRIVATE_KEY');
    const baseAddr = this.configService.get<string>('BASE_CONTRACT_ADDRESS');
    if (!basePrivateKey || !baseAddr) {
      throw new Error('Base config missing');
    }

    const celoPrivateKey = this.configService.get<string>('CELO_PRIVATE_KEY');
    const celoAddr = this.configService.get<string>('CELO_CONTRACT_ADDRESS');
    if (!celoPrivateKey || !celoAddr) {
      throw new Error('Celo config missing');
    }
    this.wallets = {
      base: new ethers.Wallet(basePrivateKey, this.providers.base),
      celo: new ethers.Wallet(celoPrivateKey, this.providers.celo),
    };

    this.contracts = {
      base: new ethers.Contract(baseAddr, this.abi, this.wallets.base),
      celo: new ethers.Contract(celoAddr, this.abi, this.wallets.celo),
    };
  }

  public getContract(chain: Chain): ethers.Contract {
    return this.contracts[chain];
  }

  async tipUser(
    chain: Chain,
    recipientUsername: string,
    amount: string,
    token: string,
    senderUsername: string,
    context: string,
  ) {
    const contract = this.getContract(chain);
    const tx = await contract.tipUser(
      recipientUsername,
      ethers.parseUnits(amount, 18),
      token,
      senderUsername,
      context,
    );
    const receipt = await tx.wait();
    this.logger.log(`${chain} tip tx: ${receipt.transactionHash}`);
    return receipt;
  }

  async payRoomEntry(
    chain: Chain,
    roomId: string,
    roomCreator: string,
    entryFee: string,
    token: string,
    username: string,
  ) {
    const contract = this.getContract(chain);
    const tx = await contract.payRoomEntry(
      roomId,
      roomCreator,
      ethers.parseUnits(entryFee, 18),
      token,
      username,
    );
    return await tx.wait();
  }

  async createUser(chain: Chain, username: string): Promise<string> {
    return await this.getContract(chain).createUser(username);
  }

  async getUserAddress(chain: Chain, username: string): Promise<string> {
    return await this.getContract(chain).getUserOnchainAddress(username);
  }
  async getAccumulatedFees(chain: Chain): Promise<string> {
    const fees = await this.getContract(chain).getAccumulatedFees();
    return ethers.formatUnits(fees, 18);
  }
}
