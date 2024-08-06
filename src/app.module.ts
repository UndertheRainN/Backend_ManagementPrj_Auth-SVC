import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      inject: [ConfigService],
      driver: ApolloFederationDriver,
      useFactory: (config: ConfigService) => ({
        path: 'auth',
        autoSchemaFile: { federation: 2 },
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'interface',
        },
        // context: ({ req }: any) => {
        //   if (config.get<string>('SECURIRY') === req.headers['x-security']) {
        //     return { req };
        //   }
        // },
      }),
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
