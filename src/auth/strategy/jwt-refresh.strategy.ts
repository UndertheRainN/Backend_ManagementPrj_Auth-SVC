import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { get } from 'lodash';
import { PinoLogger } from 'nestjs-pino';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('jwt-refresh'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH'),
    });
    console.log(ExtractJwt.fromHeader('jwt-refresh'));
    this.logger.setContext(JwtRefreshStrategy.name);
  }
  async validate(payload: any) {
    return payload;
  }
}
