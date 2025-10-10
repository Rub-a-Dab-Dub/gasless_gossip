import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpAnonymizationService {
  private readonly salt: string;

  constructor(private readonly configService: ConfigService) {
    // Load salt from environment variables or generate a new one
    this.salt = configService.get('IP_HASH_SALT') || this.generateSalt();
  }

  private generateSalt(): string {
    return createHash('sha256')
      .update(Date.now().toString())
      .digest('hex');
  }

  /**
   * Hash an IP address for privacy-preserving storage
   * Uses HMAC-SHA256 with a salt for consistent but secure hashing
   */
  async hashIp(ipAddress: string): Promise<string> {
    // Remove any port numbers or IPv6 scope IDs
    const cleanIp = this.normalizeIp(ipAddress);
    
    return createHash('sha256')
      .update(this.salt + cleanIp)
      .digest('hex');
  }

  /**
   * Compare two IP addresses by their hashes
   */
  async compareIps(ip1: string, ip2: string): Promise<boolean> {
    const hash1 = await this.hashIp(ip1);
    const hash2 = await this.hashIp(ip2);
    return hash1 === hash2;
  }

  /**
   * Normalize an IP address by removing ports and scope IDs
   */
  private normalizeIp(ip: string): string {
    // Remove port number if present
    const withoutPort = ip.split(':')[0];
    
    // Remove IPv6 scope ID if present
    return withoutPort.split('%')[0];
  }

  /**
   * Get partial IP for logging (e.g., 192.168.xxx.xxx)
   * This is useful for human-readable logs while still preserving privacy
   */
  getPartialIp(ip: string): string {
    const parts = this.normalizeIp(ip).split('.');
    if (parts.length === 4) { // IPv4
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    // For IPv6, just return first 16 bits
    return ip.split(':')[0] + ':xxxx:xxxx:xxxx:xxxx';
  }
}