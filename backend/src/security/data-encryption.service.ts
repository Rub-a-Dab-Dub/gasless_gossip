import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

interface EncryptionResult {
  iv: string;
  authTag: string;
  ciphertext: string;
}

@Injectable()
export class DataEncryptionService {
  private readonly encryptionKey: Buffer;
  private readonly hmacKey: Buffer;

  constructor() {
    const enc = process.env.ENCRYPTION_KEY || '';
    const mac = process.env.HMAC_KEY || '';

    if (enc.length !== 64) {
      // 32 bytes hex for AES-256 key
      throw new Error('ENCRYPTION_KEY must be 64 hex chars (32 bytes)');
    }
    if (mac.length !== 64) {
      throw new Error('HMAC_KEY must be 64 hex chars (32 bytes)');
    }

    this.encryptionKey = Buffer.from(enc, 'hex');
    this.hmacKey = Buffer.from(mac, 'hex');
  }

  encrypt(plaintext: string, aad?: string): EncryptionResult {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    if (aad) {
      cipher.setAAD(Buffer.from(aad));
    }
    const ciphertext = Buffer.concat([
      cipher.update(Buffer.from(plaintext, 'utf8')),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return {
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      ciphertext: ciphertext.toString('base64'),
    };
  }

  decrypt(data: EncryptionResult, aad?: string): string {
    const iv = Buffer.from(data.iv, 'base64');
    const authTag = Buffer.from(data.authTag, 'base64');
    const ciphertext = Buffer.from(data.ciphertext, 'base64');
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      iv,
    );
    if (aad) {
      decipher.setAAD(Buffer.from(aad));
    }
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return plaintext.toString('utf8');
  }

  computeSearchHash(value: string): string {
    return crypto
      .createHmac('sha256', this.hmacKey)
      .update(value)
      .digest('hex');
  }
}
