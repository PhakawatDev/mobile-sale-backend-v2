import { AppError } from "../../core/errors/AppError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { UserDto } from "./user.dto";
import { Prisma, PrismaClient, User } from "@prisma/client";

export class UserRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  createMany(data: Prisma.UserCreateManyInput[]): Promise<Prisma.BatchPayload> {
    return this.prisma.user.createMany({ data });
  }

  findFirst(): Promise<User | null> {
    return this.prisma.user.findFirst();
  }

  updateStatusById(id: string, status: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: id },
      data: { status: status },
    });
  }

  async findFirstById(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new AppError(
        "User not found",
        StatusCodes.NOT_FOUND,
        ReasonPhrases.NOT_FOUND
      );
    }
    return user;
  }

  getList(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { status: "active" },
      orderBy: { id: "desc" },
    });
  }

  updateById(id: string, data: UserDto): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  findUserByUsernamePassword(
    username: string,
    password: string
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        username: username,
        password: password,
        status: "active",
      },
    });
  }
}
