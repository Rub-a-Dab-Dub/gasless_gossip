import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private users = new Map<string, any>();

  async register(dto: RegisterDto) {
    const id = Date.now().toString();
    const user = { id, username: dto.username, email: dto.email || null };
    this.users.set(id, { ...user, password: dto.password });
    // do NOT store passwords like this in prod
    return { user, accessToken: `mock-token-${id}` };
  }

  async validateUser(username: string, password: string) {
    for (const [, u] of this.users) {
      if (u.username === username && u.password === password) {
        const { password: _p, ...user } = u;
        return user;
      }
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) return null;
    return { user, accessToken: `mock-token-${user.id}` };
  }
}
