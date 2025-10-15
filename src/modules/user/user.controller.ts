import { Request, Response } from "express";
import { AppLogger } from "../../core/logger/logger";
import { UserService } from "./user.service";
import { UpdateUserRequest, signInDto } from "./user.dto";
import { fail, ok } from "../../core/http/response";
import { AppError } from "../../core/errors/AppError";
import { ParsedQs } from "qs";

export class UserController {
  private readonly logger = new AppLogger(UserController);
  private readonly service: UserService;

  constructor() {
    this.service = new UserService();
  }

  signIn = async (req: Request<{}, any, signInDto>, res: Response) => {
    this.logger.debug(`User signIn ...`);
    try {
      const result = await this.service.signInProgress(req.body);

      return ok(res, req, result, { message: "sign-in success" });
    } catch (error) {
      this.logger.error("SIGN_IN_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "SIGN_IN_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  info = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getInfo(req);

      return ok(res, req, result, { message: "Get Info success" });
    } catch (error) {
      this.logger.error("INFO_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "INFO_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  update = async (req: UpdateUserRequest, res: Response) => {
    this.logger.info("Update User...");
    try {
      const result = await this.service.update(req);

      return ok(res, req, result, { message: "update user success" });
    } catch (error: any) {
      this.logger.error("USER_UPDATE_FAILED", {
        err: (error as Error).message,
      });
      return fail(res, req, error.message, 500, { code: error.statusCode });
    }
  };

  list = async (req: Request, res: Response) => {
    this.logger.info("Get List User...");
    try {
      const result = await this.service.getList();
      return ok(res, req, result, { message: "Get lists user success" });
    } catch (error) {
      this.logger.error("LIST_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "LIST_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  create = async (req: UpdateUserRequest, res: Response) => {
    this.logger.info("Create User...");
    try {
      const result = await this.service.createUser(req.body);
      return ok(res, req, result, { message: "Create user success" });
    } catch (error) {
      this.logger.error("CREATE_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "CREATE_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  remove = async (req: Request, res: Response) => {
    this.logger.info("Remove User...");
    try {
      const result = await this.service.remove(req.params.id);
      return ok(res, req, result, { message: "Remove user success" });
    } catch (error) {
      this.logger.error("REMOVE_USER_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code =
        error instanceof AppError ? error.code : "REMOVE_USER_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  updateRow = async (req: Request, res: Response) => {
    this.logger.info("Update User by id ...");
    try {
      const result = await this.service.updateUserById(req.params.id, req.body);
      return ok(res, req, result, { message: "update user success" });
    } catch (error) {
      this.logger.error("UPDATE_ROW_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "UPDATE_ROW_FAILED";
      return fail(res, req, message, status, { code });
    }
  };
}
