import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Account,
  Contract,
  RpcProvider,
  shortString,
  Call,
  EstimateFeeResponse,
  BigNumberish,
} from 'starknet';
import { STARKNET_ABI } from './abis/starknet-abi';

interface ExecuteOptions {
  maxFee?: BigNumberish;
  nonce?: BigNumberish;
}

@Injectable()
export class StarknetService implements OnModuleInit {
  private readonly logger = new Logger(StarknetService.name);
  public provider: RpcProvider;
  public account: Account;
  public contract: Contract;

  constructor(private configService: ConfigService) {
    this.initializeProvider();
    this.initializeAccount();
    this.initializeContract();
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  private initializeProvider() {
    const rpcUrl = this.configService.get<string>('STARKNET_RPC_URL');
    if (!rpcUrl) throw new Error('STARKNET_RPC_URL is missing in .env');

    this.provider = new RpcProvider({
      nodeUrl: rpcUrl,
      blockIdentifier: 'latest',
    });
    this.logger.log(`Starknet RPC: ${rpcUrl}`);
  }

  private initializeAccount() {
    const privateKey = this.configService.get<string>('STARKNET_PRIVATE_KEY');
    const accountAddress = this.configService.get<string>(
      'STARKNET_ACCOUNT_ADDRESS',
    );

    if (!privateKey || !accountAddress) {
      throw new Error(
        'STARKNET_PRIVATE_KEY or STARKNET_ACCOUNT_ADDRESS missing',
      );
    }

    this.account = new Account(this.provider, accountAddress, privateKey);
    this.logger.log(`Account: ${accountAddress}`);
  }

  private initializeContract() {
    const contractAddress = this.configService.get<string>(
      'STARKNET_CONTRACT_ADDRESS',
    );
    if (!contractAddress) throw new Error('STARKNET_CONTRACT_ADDRESS missing');

    this.contract = new Contract(STARKNET_ABI, contractAddress, this.provider);
    this.contract.connect(this.account);
    this.logger.log(`Contract: ${contractAddress}`);
  }

  // ============================================================
  // HEALTH & VALIDATION
  // ============================================================

  async onModuleInit() {
    // await this.healthCheck();
    // await this.validateAccountDeployment();
    // await this.ensureAccountHasFunds();
  }

  private async healthCheck() {
    const rpcUrl = this.configService.get<string>('STARKNET_RPC_URL');
    try {
      const chainId = await this.provider.getChainId();
      this.logger.log(`Starknet RPC OK | Chain ID: ${chainId}`);
    } catch (error) {
      this.logger.error('Starknet RPC UNREACHABLE', error.message);
      throw new Error(`RPC failed: ${rpcUrl}. Use Blast/Alchemy/Infura.`);
    }
  }

  private async validateAccountDeployment() {
    const deployed = await this.isAccountDeployed();
    if (!deployed) {
      this.logger.error(`Account ${this.account.address} is NOT deployed!`);
      throw new Error(
        `Account ${this.account.address} not deployed. Deploy it first using Braavos/Argent or deploy_account.`,
      );
    } else {
      this.logger.log(`Account ${this.account.address} is deployed`);
    }
  }
  private async isAccountDeployed(): Promise<boolean> {
    try {
      const classHash = await this.provider.getClassHashAt(
        this.account.address,
        'latest',
      );
      const isDeployed = classHash !== '0x0' && classHash !== undefined;
      this.logger.debug(
        `Account ${this.account.address} classHash: ${classHash} → deployed: ${isDeployed}`,
      );
      return isDeployed;
    } catch (error: any) {
      if (
        error.message.includes('Contract not found') ||
        error.message.includes('0x0') ||
        error.message.includes('No class hash') ||
        error.message.includes('Invalid block id')
      ) {
        return false;
      }
      this.logger.warn('getClassHashAt failed', error.message);
      return false;
    }
  }

  // ============================================================
  // CORE: SAFE EXECUTE WITH FEE ESTIMATION
  // ============================================================

  private async safeExecute(
    call: Call | Call[],
    options: ExecuteOptions = {},
  ): Promise<any> {
    const calls = Array.isArray(call) ? call : [call];

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resourceBounds = {
          l1_gas: {
            max_amount: '0x100000',
            max_price_per_unit: '0x174876e800',
          },
          l2_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
          l1_data_gas: {
            max_amount: '0x100000',
            max_price_per_unit: '0x174876e800',
          },
        };

        const feeEstimate = await this.account.estimateInvokeFee(calls, {
          blockIdentifier: 'latest',
          version: '0x3',
          resourceBounds,
          skipValidate: true,
        });

        // Use overall_fee (always exists), fallback to suggestedMaxFee
        const rawFee = feeEstimate.overall_fee ?? feeEstimate.suggestedMaxFee;
        if (!rawFee) {
          throw new Error(
            'Fee estimation failed: no overall_fee or suggestedMaxFee',
          );
        }

        const suggestedMaxFee = BigInt(rawFee);
        const maxFee = options.maxFee || (suggestedMaxFee * 12n) / 10n;

        this.logger.log(`Fee: ${suggestedMaxFee} → maxFee: ${maxFee}`);

        const tx = await this.account.execute(calls, undefined, {
          maxFee,
          version: '0x3',
          resourceBounds,
        });

        return tx;
      } catch (error: any) {
        this.logger.warn(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === 3) throw error;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  async getAccountEthBalance(): Promise<string> {
    const ETH_ADDRESS =
      process.env.ETH_SEPOLIA_ADDRESS ||
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
    const result = await this.provider.callContract(
      {
        contractAddress: ETH_ADDRESS,
        entrypoint: 'balanceOf',
        calldata: [this.account.address],
      },
      'latest',
    );

    const balance = BigInt(result[0]) + (BigInt(result[1]) << 128n);
    return (Number(balance) / 1e18).toFixed(6);
  }
  private async ensureAccountHasFunds(): Promise<void> {
    try {
      // ETH contract on Sepolia
      const ETH_ADDRESS =
        process.env.ETH_SEPOLIA_ADDRESS ||
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

      const balanceCalldata = [
        '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e', // selector(balanceOf)
        this.account.address, // address
      ];

      const result = await this.provider.callContract(
        {
          contractAddress: ETH_ADDRESS,
          entrypoint: 'balanceOf',
          calldata: [this.account.address],
        },
        'latest',
      );

      // result[0] = low, result[1] = high (u256)
      const balance = BigInt(result[0]) + (BigInt(result[1]) << 128n);
      const ethBalance = Number(balance) / 1e18;

      if (ethBalance < 0.001) {
        throw new Error(
          `Account ${this.account.address} has insufficient ETH: ${ethBalance.toFixed(6)} ETH. ` +
            `Fund it at: https://starknet-faucet.vercel.app`,
        );
      }

      this.logger.log(`Account ETH balance: ${ethBalance.toFixed(6)} ETH`);
    } catch (error: any) {
      this.logger.error('Failed to check ETH balance', error.message);
      throw error;
    }
  }

  // ======
  // ======================================================
  // PUBLIC METHODS
  // ============================================================

  async createUser(username: string): Promise<string> {
    await this.ensureAccountHasFunds();
    if (!username || username.length === 0) {
      throw new Error('Username cannot be empty');
    }

    const usernameFelt = shortString.encodeShortString(username);
    this.logger.log(`Creating user: ${username} → ${usernameFelt}`);

    const call = this.contract.populate('create_user', [usernameFelt]);
    const tx = await this.safeExecute(call);

    await this.provider.waitForTransaction(tx.transaction_hash);
    this.logger.log(`User created: ${username} | tx: ${tx.transaction_hash}`);

    return tx.transaction_hash;
  }

  async tipUser(
    recipient: string,
    amount: { low: string; high: string },
    context: string,
  ): Promise<{ success: boolean; txHash: string }> {
    if (!recipient || !amount || !context) {
      throw new Error('Missing tip parameters');
    }

    const call = this.contract.populate('tip_user', {
      recipient,
      amount,
      context: shortString.encodeShortString(context),
    });

    const tx = await this.safeExecute(call);
    await this.provider.waitForTransaction(tx.transaction_hash);

    this.logger.log(`Tip sent: ${amount.low} | tx: ${tx.transaction_hash}`);
    return { success: true, txHash: tx.transaction_hash };
  }

  async getUserBalance(user: string): Promise<string> {
    try {
      const { balance } = await this.contract.get_user_balance(user);
      return balance.toString();
    } catch (error) {
      this.logger.error('get_user_balance failed', error);
      throw error;
    }
  }

  async getUserAddress(username: string): Promise<string> {
    try {
      const usernameFelt = shortString.encodeShortString(username);
      return await this.contract.get_user_onchain_address(usernameFelt);
    } catch (error) {
      this.logger.error('get_user_onchain_address failed', error);
      throw error;
    }
  }

  async getUsernameByWallet(wallet: string): Promise<string> {
    try {
      const usernameFelt = await this.contract.get_username_by_wallet(wallet);
      return shortString.decodeShortString(usernameFelt);
    } catch (error) {
      this.logger.error('get_username_by_wallet failed', error);
      throw error;
    }
  }

  // Optional: Withdraw from user wallet
  async withdrawFromUserWallet(
    token: string,
    username: string,
    recipient: string,
    amount: { low: string; high: string },
  ): Promise<string> {
    const usernameFelt = shortString.encodeShortString(username);
    const call = this.contract.populate('withdraw_from_userwallet', [
      token,
      usernameFelt,
      recipient,
      amount,
    ]);

    const tx = await this.safeExecute(call);
    await this.provider.waitForTransaction(tx.transaction_hash);
    return tx.transaction_hash;
  }
}
