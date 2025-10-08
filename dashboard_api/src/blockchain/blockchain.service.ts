import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;

  constructor() {
    // Initialize with your RPC and private key
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
  }

  async batchTransfer(
    tokenAddress: string,
    transfers: Array<{ address: string; amount: number }>,
  ): Promise<string> {
    const ERC20_ABI = [
      'function transfer(address to, uint256 amount) returns (bool)',
    ];

    const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);

    // Batch transfers (consider using multicall for efficiency)
    const txs = [];
    for (const t of transfers) {
      const amount = ethers.parseUnits(t.amount.toString(), 18);
      const tx = await token.transfer(t.address, amount);
      txs.push(tx.hash);
      await tx.wait();
    }

    this.logger.log(`Batch transfer completed: ${txs[0]}`);
    return txs[0]; // Return first tx hash
  }

  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt && receipt.status === 1;
    } catch (error) {
      this.logger.error(`Failed to verify tx: ${error.message}`);
      return false;
    }
  }
}