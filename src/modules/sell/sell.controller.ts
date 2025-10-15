import { Request, Response } from "express";
import { AppError } from "../../core/errors/AppError";
import { fail, ok } from "../../core/http/response";
import { AppLogger } from "../../core/logger/logger";
import { UpdateSellRequest } from "./sell.dto";
import { SellService } from "./sell.service";
import { log } from "console";

export class SellController {
  private readonly logger = new AppLogger(SellController);
  private readonly service: SellService;

  constructor() {
    this.service = new SellService();
  }

  create = async (req: UpdateSellRequest, res: Response) => {
    this.logger.debug(`Sell create ...`);
    try {
      const result = await this.service.create(req.body);

      return ok(res, req, result, { message: "create Sell success" });
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

  list = async (req: Request, res: Response) => {
    this.logger.debug(`Sell list ...`);
    try {
      const result = await this.service.getList();

      return ok(res, req, result, { message: "list Sell success" });
    } catch (error) {
      this.logger.error("SELL_LIST_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "SELL_LIST_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  remove = async (req: Request<{ id: string }>, res: Response) => {
    this.logger.debug(`Sell remove ...`);
    try {
      const result = await this.service.remove(req.params.id);

      return ok(res, req, result, { message: "remove Sell success" });
    } catch (error) {
      this.logger.error("SELL_REMOVE_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code =
        error instanceof AppError ? error.code : "SELL_REMOVE_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  confirm = async (req: Request, res: Response) => {
    this.logger.debug(`Sell confirm ...`);
    try {
      const result = await this.service.confirmAll();

      return ok(res, req, result, {
        message: "All pending sells confirmed as paid",
      });
    } catch (error) {
      this.logger.error("CONFIRM_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code = error instanceof AppError ? error.code : "CONFIRM_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  dashboard = async (req: Request<{ year?: string }>, res: Response) => {
    this.logger.debug(`Sell Dashboard ...`);
    try {
      const result = await this.service.getDashboardData(req.params.year);

      return ok(res, req, result, {
        message: "Sell dashboard data fetched successfully",
      });
    } catch (error) {
      this.logger.error("DASHBOARD_FETCH_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code =
        error instanceof AppError ? error.code : "DASHBOARD_FETCH_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  history = async (req: Request, res: Response) => {
    this.logger.debug(`Sell history ...`);
    try {
      const result = await this.service.getHistory();
      return ok(res, req, result, {
        message: "Sell history fetched successfully",
      });
    } catch (error) {
      this.logger.error("HISTORY_FETCH_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code =
        error instanceof AppError ? error.code : "HISTORY_FETCH_FAILED";
      return fail(res, req, message, status, { code });
    }
  };

  info = async (req: Request<{ id: string }>, res: Response) => {   
    this.logger.debug(`Sell info ...`);
    try {
      const result = await this.service.getInfo(req.params.id);
      return ok(res, req, result, {
        message: "Sell info fetched successfully",
      });
    } catch (error) {
      this.logger.error("INFO_FETCH_FAILED", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const message = error instanceof Error ? error.message : "Unknown error";
      const status = error instanceof AppError ? error.statusCode : 500;
      const code =
        error instanceof AppError ? error.code : "INFO_FETCH_FAILED";
      return fail(res, req, message, status, { code });
    }
  }
}
