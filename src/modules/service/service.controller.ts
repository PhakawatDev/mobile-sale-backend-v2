import { AppError } from "../../core/errors/AppError";
import { Request, Response } from "express";
import { fail, ok } from "../../core/http/response";
import { AppLogger } from "../../core/logger/logger";
import { CreateServiceRequest } from "./service.dto";
import { ServiceService } from "./service.service";

export class ServiceController {
  private readonly logger = new AppLogger(ServiceController);
  private readonly service: ServiceService;

  constructor() {
    this.service = new ServiceService();
  }

  create = async (req: CreateServiceRequest, res: Response) => {
    this.logger.debug(`Create service ...`);
    try {
      const result = await this.service.create(req.body);
      return ok(res, req, result, { message: "Create service success" });
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

  list = async (req: Request, res: Response) => {
    this.logger.debug(`List Service...`);
    try {
      const result = await this.service.getAllList();
      return ok(res, req, result, { message: "Get list success" });
    } catch (error) {
      this.logger.error("GET_LIST_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "GET_LIST_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  update = async (req: CreateServiceRequest, res: Response) => {
    try {
      const result = await this.service.update(req.params.id, req.body);
      return ok(res, req, result, { message: "Update success" });
    } catch (error) {
      this.logger.error("UPDATE_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "UPDATE_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const result = await this.service.remove(req.params.id);
      return ok(res, req, result, { message: "remove success" });
    } catch (error) {
      this.logger.error("REMOVE_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "REMOVE_FAILED";
      return fail(res, req, message, status, { code });
    }
  };
}
