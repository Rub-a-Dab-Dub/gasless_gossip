import { Injectable } from "@nestjs/common"
import { randomBytes } from "crypto"

@Injectable()
export class CodeGeneratorService {
  private readonly CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  private readonly CODE_LENGTH = 12

  generateInvitationCode(): string {
    // Generate cryptographically secure random code
    const bytes = randomBytes(this.CODE_LENGTH)
    let result = ""

    for (let i = 0; i < this.CODE_LENGTH; i++) {
      result += this.CHARACTERS[bytes[i] % this.CHARACTERS.length]
    }

    // Format as XXX-XXX-XXX-XXX for readability (but store without dashes)
    return result
  }

  formatCodeForDisplay(code: string): string {
    // Format code as XXX-XXX-XXX-XXX for better readability
    return code.replace(/(.{3})/g, "$1-").slice(0, -1)
  }

  validateCodeFormat(code: string): boolean {
    // Remove any dashes and validate
    const cleanCode = code.replace(/-/g, "")
    return /^[A-Z0-9]{12}$/.test(cleanCode)
  }

  normalizeCode(code: string): string {
    // Remove dashes and convert to uppercase
    return code.replace(/-/g, "").toUpperCase()
  }

  generateShareableUrl(code: string, baseUrl?: string): string {
    const base = baseUrl || process.env.FRONTEND_URL || "https://whisper.app"
    return `${base}/join/${code}`
  }

  generateQRCodeData(code: string): string {
    const url = this.generateShareableUrl(code)
    return url
  }
}
