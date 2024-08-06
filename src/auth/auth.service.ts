import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput, RefreshTokenInput } from './dto/login.input';
import { InjectGraphQLClient } from '@golevelup/nestjs-graphql-request';
import { GraphQLClient, gql, ClientError } from 'graphql-request';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { verify } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(
    @InjectGraphQLClient() private readonly client: GraphQLClient,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findByUserName(loginInput: LoginInput): Promise<User> {
    try {
      const res: { findByUserName: User } = await this.client.request<{
        findByUserName: User;
      }>(
        gql`
          query ($username: String!) {
            findByUserName(username: $username) {
              _id
              username
              password
              createdAt
              updatedAt
              description
              status
              img_avatar
              email
              birth_day
              roleCode
              role {
                code
                name
                createdAt
                updatedAt
                description
                status
                menus {
                  access
                  menuId {
                    _id
                    code
                    name
                    path
                    parent_id
                    level
                    services {
                      code
                    }
                  }
                }
              }
              phone
              first_name
              last_name
            }
          }
        `,
        { username: loginInput.username },
      );
      return res.findByUserName;
    } catch (error) {
      const clientError = error as ClientError;
      const graphqlErrors = clientError.response.errors;
      new BadRequestException(graphqlErrors[0] && graphqlErrors[0].message);
    }
  }

  async createToken(payload: {
    userId: string;
    role: string;
    services: string[];
  }): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    const refresh_token = await this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: this.configService.get<string>('JWT_REFRESH'),
    });
    return { access_token, refresh_token };
  }

  decodeToken(tokenString: string) {
    const decoded = verify(
      tokenString,
      this.configService.get<string>('JWT_REFRESH'),
    );
    if (!decoded) {
      throw new UnauthorizedException();
    }
    return decoded;
  }

  async refreshToken(
    refershToken: RefreshTokenInput,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const refresh_token = await this.cacheManager.get(refershToken._id);
    if (refresh_token !== refershToken.refresh_token)
      throw new UnauthorizedException();
    const decoded: any = this.decodeToken(refresh_token);
    const token = await this.createToken(decoded);
    return token;
  }
}
