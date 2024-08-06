import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  Menu,
  RoleMenu,
  Service,
  Token,
  User,
  UserNotPassword,
} from './entities/user.entity';
import { LoginInput, RefreshTokenInput } from './dto/login.input';
import { BadRequestException, Inject, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PinoLogger } from 'nestjs-pino';
import { compareKey, generatePassword } from 'src/common/encryption .common';
import { PasswordUtils } from 'src/util/password.util';
import {
  CACHE_MANAGER,
  Cache,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import { LocalAuthGuard } from './guard/local.guard';
import { GqlAuthGuard } from './guard/gql-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private logger: PinoLogger,
    private passwordUitl: PasswordUtils,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.logger.setContext(AuthResolver.name);
  }

  @Query(() => String, { name: 'generatePassword' })
  async generatePassword(@Args('password') password: string): Promise<string> {
    return await this.passwordUitl.generatePassword(password);
  }

  @Mutation(() => UserNotPassword, { name: 'login' })
  @CacheTTL(5 * 24 * 60 * 60)
  @CacheKey('login')
  // @UseGuards(LocalAuthGuard)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<UserNotPassword> {
    const user = await this.authService.findByUserName(loginInput);
    if (!user) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (user.status === 'I') {
      throw new BadRequestException(
        'Tài khoản tạm khoá, vui lòng kiểm tra lại ',
      );
    }
    const decryptPassword = await this.passwordUitl.compareKey(
      loginInput.password,
    );
    //So sánh với mật khẩu lưu trong DB
    const isMatch = await this.passwordUitl.compare(
      loginInput.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu không đúng');
    }
    const menus = user.role.menus;
    let services: string[] = [];
    menus.forEach((value: RoleMenu) => {
      const { access, menuId } = value;
      menuId.services.forEach((_value: Service) => {
        if (
          access.findIndex((_access: string) => _value.code.includes(_access)) >
          -1
        ) {
          services.push(_value.code);
        }
      });
    });
    const payload = { userId: user._id, role: user.roleCode, services };
    const token = await this.authService.createToken(payload);
    const { password, ...params } = user;
    this.cacheManager.set(user._id, token.refresh_token, 24 * 60 * 60);
    return {
      ...params,
      menus,
      ...token,
      token_type: 'Bearer',
      expiresIn: 30 * 60,
    };
  }

  @Mutation(() => Token)
  @UseGuards(RefreshAuthGuard)
  refreshToken(@Args('refreshToken') refershToken: RefreshTokenInput) {
    console.log(refershToken, 'mmm');
    return this.authService.refreshToken(refershToken);
  }
}
