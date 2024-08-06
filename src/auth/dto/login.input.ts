import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';
import { InputType, Field, Int, PartialType, PickType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field({ description: 'Tên đăng nhập' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MaxLength(20, { message: 'Giới hạn tối đa là 20 ký tự' })
  @MinLength(5, { message: 'Giới hạn tối thiểu là 5 ký tự' })
  username: string;
  @Field({ description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

@InputType()
export class RefreshTokenInput {
  @Field({ description: 'ID user' })
  @IsNotEmpty({ message: 'ID user không được để trống' })
  _id: string;
  @Field({ description: 'refresh token' })
  @IsNotEmpty({ message: 'refresh token không được để trống' })
  refresh_token: string;
}
