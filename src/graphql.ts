
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface LoginInput {
    username: string;
    password: string;
}

export interface RefreshTokenInput {
    _id: string;
    refresh_token: string;
}

export interface Service_auth {
    code: string;
}

export interface Menu_auth {
    _id: string;
    code: string;
    name: string;
    path: string;
    parent_id: string;
    level: number;
    services: Service_auth[];
}

export interface User_role_menu_auth {
    menuId: Menu_auth;
    access: string[];
}

export interface User_role_auth {
    code: string;
    menus: User_role_menu_auth[];
    name: string;
}

export interface User_not_password {
    _id: string;
    username: string;
    description?: Nullable<string>;
    status?: Nullable<string>;
    img_avatar?: Nullable<string>;
    email?: Nullable<string>;
    birth_day?: Nullable<DateTime>;
    roleCode?: Nullable<string>;
    role: User_role_auth;
    phone?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
    menus: User_role_menu_auth[];
    token_type: string;
    expiresIn: number;
}

export interface Token {
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
}

export interface IQuery {
    generatePassword(password: string): string | Promise<string>;
}

export interface IMutation {
    login(loginInput: LoginInput): User_not_password | Promise<User_not_password>;
    refreshToken(refreshToken: RefreshTokenInput): Token | Promise<Token>;
}

export type DateTime = any;
type Nullable<T> = T | null;
