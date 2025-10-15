import { AppError } from "../../core/errors/AppError";
import { AppLogger } from "../../core/logger/logger";
import { UserDto, UpdateUserRequest, signInDto } from "./user.dto";
import { UserRepository } from "./user.repository";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request } from "express";
import { Prisma, User } from "@prisma/client";

export class UserService {
  private readonly logger = new AppLogger(UserService);
  private readonly userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async signInProgress(
    payload: signInDto
  ): Promise<{ token: string; level: string }> {
    const user = await this.userRepo.findUserByUsernamePassword(
      payload.username,
      payload.password
    );

    if (!user) {
      throw new AppError(
        "User not found",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      );
    }

    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new AppError(
        "SECRET_KEY is not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }

    // const token = jwt.sign({ id: user.id }, secret , { expiresIn: "1h" });
    const token = jwt.sign({ sub: user.id, level: user.level }, secret, {
      expiresIn: "1h",
    });

    return { token, level: user.level };
  }

  private getBearerToken(req: Request): string {
    const h = req.headers.authorization;
    if (!h)
      throw new AppError(
        "Missing Authorization header",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      );

    const [scheme, token] = h.split(" ");

    if (scheme !== "Bearer" || !token)
      throw new AppError(
        "Invalid Authorization",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      );

    return token;
  }

  async getList(): Promise<User[]> {
    return this.userRepo.getList();
  }

  async getInfo(req: Request): Promise<User> {
    const token = this.getBearerToken(req);
    const secret = process.env.SECRET_KEY!;
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") {
      throw new AppError(
        "Invalid token payload",
        StatusCodes.UNAUTHORIZED,
        ReasonPhrases.UNAUTHORIZED
      );
    }

    const userId = (decoded.id ?? decoded.sub)?.toString();

    const user = await this.userRepo.findFirstById(userId);

    return user;
  }

  async update(req: UpdateUserRequest): Promise<User> {
    const oldUser = await this.getInfo(req);
    const dto = req.body;

    this.logger.debug(`old User => ${JSON.stringify(oldUser)}`);
    this.logger.debug(`dto User => ${JSON.stringify(dto)}`);

    if (!oldUser) {
      throw new AppError(
        "User not found",
        StatusCodes.NOT_FOUND,
        "USER_NOT_FOUND"
      );
    }

    let newPassword = oldUser.password;
    if (typeof dto.password === "string" && dto.password.trim() !== "") {
      newPassword = dto.password;
    }

    const data: UserDto = {
      name: dto.name ?? oldUser.name,
      username: dto.username ?? oldUser.username,
      password: newPassword,
      level: dto.level ?? oldUser.level,
    };

    return this.userRepo.updateById(oldUser.id, data);
  }

  async createUser(dto: UserDto): Promise<User> {
    //validation
    if (!dto.username) {
      throw new Error("username is required");
    }
    if (!dto.password) {
      throw new Error("username is required");
    }
    const data: Prisma.UserCreateInput = {
      name: dto.name,
      username: dto.username,
      password: dto.password,
      level: dto.level,
      status: "active",
    };

    this.logger.debug(`Create User data :: ${JSON.stringify(data, null, 2)}`);
    return await this.userRepo.create(data);
  }

  async remove(id: string): Promise<User> {
    this.logger.debug(`Removing user: ${id}`);

    const user = await this.userRepo.updateStatusById(id, "INACTIVE");

    this.logger.info(`User ${id} set to INACTIVE`);
    return user;
  }

  async updateUserById(id: string, dto: UserDto): Promise<User> {
      const oldUser = await this.userRepo.findFirstById(id);
      const newPassword = dto.password !== "" ? dto.password : oldUser.password;
      const data: UserDto = {
        name: dto.name ?? oldUser.name,
        username: dto.username ?? oldUser.username,
        password: newPassword,
        level: dto.level ?? oldUser.level,
      };
      return this.userRepo.updateById(id, data);
  }
}
