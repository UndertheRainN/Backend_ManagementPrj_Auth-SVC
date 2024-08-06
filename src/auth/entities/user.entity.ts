import { ObjectType, Field, ID, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@ObjectType('Service_auth')
export class Service {
  @Field()
  code: string;
}

@ObjectType('Menu_auth')
export class Menu {
  @Field()
  _id: string;
  @Field()
  code: string;
  @Field()
  name: string;
  @Field()
  path: string;
  @Field()
  parent_id: string;
  @Field()
  level: number;
  @Field(() => [Service])
  services: Service[];
}

@ObjectType('User_role_menu_auth')
export class RoleMenu {
  @Field(() => Menu)
  menuId?: Menu;
  @Field(() => [String])
  access?: string[];
}

@ObjectType('User_role_auth')
export class Roles {
  @Field()
  code: string;
  @Field(() => [RoleMenu])
  menus: RoleMenu[];
  @Field()
  name: string;
}

@ObjectType('user_auth')
export class User {
  @Field(() => ID)
  _id: string;
  @Field({ description: 'Tên đăng nhập' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MaxLength(20, { message: 'Giới hạn tối đa là 20 ký tự' })
  @MinLength(5, { message: 'Giới hạn tối thiểu là 5 ký tự' })
  username: string;
  @Field({ description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
  @Field({ nullable: true, description: 'Mô tả' })
  description?: string;
  @Field({ description: 'Trạng thái', defaultValue: 'A', nullable: true })
  status?: 'A' | 'I';
  @Field({ description: 'Ảnh Avatar', name: 'img_avatar', nullable: true })
  img_avatar?: string;
  @Field({ description: 'Email', nullable: true })
  email?: string;
  @Field({ description: 'Ngày sinh', nullable: true, name: 'birth_day' })
  birth_day?: Date;
  @Field({ description: 'Vai trò', nullable: true })
  roleCode?: string;
  @Field((type) => Roles, { name: 'role' })
  role: Roles;
  @Field({ description: 'Số điện thoại', nullable: true })
  phone?: string;
  @Field({ description: 'Họ', nullable: true, name: 'firstName' })
  first_name?: string;
  @Field({ description: 'Tên', nullable: true, name: 'lastName' })
  last_name?: string;
}

@ObjectType('User_not_password')
export class UserNotPassword extends OmitType(User, ['password']) {
  @Field({ description: 'access token', nullable: true })
  access_token: string;
  @Field({ description: 'refresh token', nullable: true })
  refresh_token: string;
  @Field(() => [RoleMenu])
  menus: RoleMenu[];
  @Field(() => String)
  token_type: string;
  @Field()
  expiresIn: number;
}

@ObjectType()
export class Token {
  @Field({ description: 'access token', nullable: true })
  access_token: string;
  @Field({ description: 'refresh token', nullable: true })
  refresh_token: string;
}
