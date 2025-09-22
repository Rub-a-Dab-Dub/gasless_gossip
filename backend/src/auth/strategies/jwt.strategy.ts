import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import type { ConfigService } from "@nestjs/config"
import type { Repository } from "typeorm"
import type { User } from "../../users/entities/user.entity"

export interface JwtPayload {
  sub: string
  username: string
  email: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private userRepository: Repository<User>

  constructor(
    private configService: ConfigService,
    userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET", "your-secret-key"),
    })
    this.userRepository = userRepository
  }

  async validate(payload: JwtPayload) {
    // Find user in database
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      select: ["id", "username", "email", "isActive"],
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive")
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  }
}
