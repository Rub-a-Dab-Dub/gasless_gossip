import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StellarModule } from './stellar/stellar.module';
import { ChatModule } from './chat/chat.module';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Whisper API';
  }
}
