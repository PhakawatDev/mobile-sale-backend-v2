import { Request } from "express";

export interface signInDto {
    username: string;
    password: string;
}

export interface UserDto {
    name: string;
    username?: string;
    password?: string;
    level: string;
  }

  export type UpdateUserRequest = Request<{}, any, UserDto>;