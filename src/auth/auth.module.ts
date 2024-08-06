import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { GraphQLRequestModule } from '@golevelup/nestjs-graphql-request';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UtilsModule } from 'src/util/util.module';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 60,
      }),
    }),
    UtilsModule,
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     global: true,
    //     secret: config.get<string>('JWT_SECRET'),
    //     signOptions: { expiresIn: '30min' },
    //   }),
    // }),
    GraphQLRequestModule.forRootAsync(GraphQLRequestModule, {
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        endpoint: config.get<string>('USER_SVL'),
        options: {
          headers: {
            'content-type': 'application/json',
            // 'x-security': config.get<string>('SECURIRY'),
          },
        },
      }),
      // Exposes configuration options based on the graphql-request package
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
