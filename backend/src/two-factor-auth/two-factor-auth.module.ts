import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactor } from './entities/two-factor.entity';
import { TwoFactorAuthController } from './controllers/two-factor-auth.controller';
import { TwoFactorAuthService } from './services/two-factor-auth.service';
import { TwoFactorAuthGuard } from './guards/two-factor-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([TwoFactor])],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, TwoFactorAuthGuard],
  exports: [TwoFactorAuthService, TwoFactorAuthGuard],
})
export class TwoFactorAuthModule {}
