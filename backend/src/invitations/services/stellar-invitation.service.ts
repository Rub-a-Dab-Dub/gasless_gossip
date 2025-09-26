import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { Server, Keypair, TransactionBuilder, Networks, Operation, BASE_FEE } from "stellar-sdk"

export interface InvitationContractData {
  invitationId: string
  roomId: string
  inviterId: string
  inviteeId: string
  code: string
  timestamp: number
}

@Injectable()
export class StellarInvitationService {
  private readonly logger = new Logger(StellarInvitationService.name)
  private readonly server: Server
  private readonly sourceKeypair: Keypair
  private readonly networkPassphrase: string

  constructor(private configService: ConfigService) {
    const horizonUrl = this.configService.get<string>("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
    const sourceSecret = this.configService.get<string>("STELLAR_SOURCE_SECRET")
    this.networkPassphrase = this.configService.get<string>("STELLAR_NETWORK_PASSPHRASE", Networks.TESTNET)

    if (!sourceSecret) {
      throw new Error("STELLAR_SOURCE_SECRET environment variable is required")
    }

    this.server = new Server(horizonUrl)
    this.sourceKeypair = Keypair.fromSecret(sourceSecret)

    this.logger.log(`Stellar service initialized with network: ${this.networkPassphrase}`)
  }

  async recordInvitationAcceptance(data: InvitationContractData): Promise<string> {
    try {
      this.logger.log(`Recording invitation acceptance on Stellar: ${data.invitationId}`)

      // Load source account
      const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey())

      // Create contract data for the invitation
      const contractData = this.encodeInvitationData(data)

      // Build transaction with manage data operation
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: this.configService.get<string>("STELLAR_BASE_FEE", BASE_FEE),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.manageData({
            name: `invitation_${data.invitationId}`,
            value: contractData,
          }),
        )
        .addOperation(
          Operation.manageData({
            name: `room_access_${data.roomId}_${data.inviteeId}`,
            value: Buffer.from(
              JSON.stringify({
                invitationId: data.invitationId,
                grantedAt: data.timestamp,
                grantedBy: data.inviterId,
              }),
            ),
          }),
        )
        .setTimeout(this.configService.get<number>("STELLAR_TIMEOUT", 30))
        .build()

      // Sign transaction
      transaction.sign(this.sourceKeypair)

      // Submit transaction
      const result = await this.server.submitTransaction(transaction)

      this.logger.log(`Invitation acceptance recorded successfully: ${result.hash}`)
      return result.hash
    } catch (error) {
      this.logger.error(`Failed to record invitation acceptance: ${error.message}`, error.stack)
      throw new Error(`Stellar transaction failed: ${error.message}`)
    }
  }

  async verifyInvitationOnChain(invitationId: string): Promise<InvitationContractData | null> {
    try {
      this.logger.log(`Verifying invitation on-chain: ${invitationId}`)

      // Load source account to check data entries
      const account = await this.server.loadAccount(this.sourceKeypair.publicKey())
      const dataKey = `invitation_${invitationId}`

      // Check if invitation data exists on-chain
      const dataEntry = account.data_attr[dataKey]
      if (!dataEntry) {
        this.logger.warn(`Invitation not found on-chain: ${invitationId}`)
        return null
      }

      // Decode and return invitation data
      const decodedData = this.decodeInvitationData(dataEntry)
      this.logger.log(`Invitation verified on-chain: ${invitationId}`)

      return decodedData
    } catch (error) {
      this.logger.error(`Failed to verify invitation on-chain: ${error.message}`, error.stack)
      return null
    }
  }

  async verifyRoomAccess(roomId: string, userId: string): Promise<boolean> {
    try {
      this.logger.log(`Verifying room access on-chain: ${roomId} for user ${userId}`)

      // Load source account to check data entries
      const account = await this.server.loadAccount(this.sourceKeypair.publicKey())
      const dataKey = `room_access_${roomId}_${userId}`

      // Check if room access data exists on-chain
      const dataEntry = account.data_attr[dataKey]
      if (!dataEntry) {
        this.logger.warn(`Room access not found on-chain: ${roomId} for user ${userId}`)
        return false
      }

      // Decode access data
      const accessData = JSON.parse(Buffer.from(dataEntry, "base64").toString())
      this.logger.log(`Room access verified on-chain: ${roomId} for user ${userId}`, accessData)

      return true
    } catch (error) {
      this.logger.error(`Failed to verify room access on-chain: ${error.message}`, error.stack)
      return false
    }
  }

  async revokeInvitationOnChain(invitationId: string): Promise<string> {
    try {
      this.logger.log(`Revoking invitation on-chain: ${invitationId}`)

      // Load source account
      const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey())

      // Build transaction to remove invitation data
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: this.configService.get<string>("STELLAR_BASE_FEE", BASE_FEE),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.manageData({
            name: `invitation_${invitationId}`,
            value: null, // null value removes the data entry
          }),
        )
        .addOperation(
          Operation.manageData({
            name: `invitation_revoked_${invitationId}`,
            value: Buffer.from(
              JSON.stringify({
                revokedAt: Date.now(),
                reason: "invitation_revoked",
              }),
            ),
          }),
        )
        .setTimeout(this.configService.get<number>("STELLAR_TIMEOUT", 30))
        .build()

      // Sign and submit transaction
      transaction.sign(this.sourceKeypair)
      const result = await this.server.submitTransaction(transaction)

      this.logger.log(`Invitation revoked on-chain successfully: ${result.hash}`)
      return result.hash
    } catch (error) {
      this.logger.error(`Failed to revoke invitation on-chain: ${error.message}`, error.stack)
      throw new Error(`Stellar revocation failed: ${error.message}`)
    }
  }

  async getInvitationHistory(invitationId: string): Promise<any[]> {
    try {
      this.logger.log(`Getting invitation history from Stellar: ${invitationId}`)

      // Get transaction history for the source account
      const transactions = await this.server
        .transactions()
        .forAccount(this.sourceKeypair.publicKey())
        .order("desc")
        .limit(100)
        .call()

      // Filter transactions related to this invitation
      const invitationTxs = []
      for (const tx of transactions.records) {
        const operations = await tx.operations()
        for (const op of operations.records) {
          if (
            op.type === "manage_data" &&
            (op.name === `invitation_${invitationId}` || op.name === `invitation_revoked_${invitationId}`)
          ) {
            invitationTxs.push({
              hash: tx.hash,
              timestamp: tx.created_at,
              operation: op.name,
              value: op.value,
            })
          }
        }
      }

      this.logger.log(`Found ${invitationTxs.length} transactions for invitation: ${invitationId}`)
      return invitationTxs
    } catch (error) {
      this.logger.error(`Failed to get invitation history: ${error.message}`, error.stack)
      return []
    }
  }

  private encodeInvitationData(data: InvitationContractData): Buffer {
    const contractData = {
      invitationId: data.invitationId,
      roomId: data.roomId,
      inviterId: data.inviterId,
      inviteeId: data.inviteeId,
      code: data.code,
      timestamp: data.timestamp,
      version: "1.0",
    }

    return Buffer.from(JSON.stringify(contractData))
  }

  private decodeInvitationData(encodedData: string): InvitationContractData {
    const buffer = Buffer.from(encodedData, "base64")
    const data = JSON.parse(buffer.toString())

    return {
      invitationId: data.invitationId,
      roomId: data.roomId,
      inviterId: data.inviterId,
      inviteeId: data.inviteeId,
      code: data.code,
      timestamp: data.timestamp,
    }
  }

  async getAccountBalance(): Promise<{ balance: string; asset: string }[]> {
    try {
      const account = await this.server.loadAccount(this.sourceKeypair.publicKey())
      return account.balances.map((balance) => ({
        balance: balance.balance,
        asset: balance.asset_type === "native" ? "XLM" : `${balance.asset_code}:${balance.asset_issuer}`,
      }))
    } catch (error) {
      this.logger.error(`Failed to get account balance: ${error.message}`)
      return []
    }
  }

  async healthCheck(): Promise<{ status: string; network: string; account: string }> {
    try {
      const account = await this.server.loadAccount(this.sourceKeypair.publicKey())
      return {
        status: "healthy",
        network: this.networkPassphrase,
        account: this.sourceKeypair.publicKey(),
      }
    } catch (error) {
      this.logger.error(`Stellar health check failed: ${error.message}`)
      return {
        status: "unhealthy",
        network: this.networkPassphrase,
        account: this.sourceKeypair.publicKey(),
      }
    }
  }
}
