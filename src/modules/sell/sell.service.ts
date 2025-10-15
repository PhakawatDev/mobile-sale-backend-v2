import { Prisma, Sell } from "@prisma/client";
import { AppLogger } from "../../core/logger/logger";
import { SellRepository } from "./sell.repository";
import { SellDto, SellHistoryItem, dashboardResponse } from "./sell.dto";
import { ProductRepository } from "../product/product.repository";
import { AppError } from "../../core/errors/AppError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ServiceRepository } from "../service/service.repository";
import { da } from "zod/v4/locales";

export class SellService {
  private readonly logger = new AppLogger(SellService);
  private readonly sellRepo: SellRepository;
  private readonly productRepo: ProductRepository;
  private readonly serviceRepo: ServiceRepository;

  constructor() {
    this.sellRepo = new SellRepository();
    this.productRepo = new ProductRepository();
    this.serviceRepo = new ServiceRepository();
  }

  async create(payload: SellDto): Promise<Sell> {
    try {
      const product = await this.productRepo.findWhere(payload);

      if (!product) {
        throw new AppError(
          "Product not found",
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }
      const data: Prisma.SellCreateInput = {
        price: payload.price,
        product: {
          connect: { id: product.id },
        },
      };
      return await this.sellRepo.create(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger?.error("SELL_CREATE_FAILED", { err: err.message });
      }
      throw new AppError(
        "Failed to create sell",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "SELL_CREATE_FAILED"
      );
    }
  }

  async getList(): Promise<Sell[]> {
    try {
      return await this.sellRepo.listByStatus("PENDING");
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger?.error("SELL_LIST_FAILED", { err: err.message });
      }

      throw new AppError(
        "Failed to list sells",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "SELL_LIST_FAILED"
      );
    }
  }

  async remove(id: string): Promise<Sell> {
    try {
      return await this.sellRepo.deleteById(id);
    } catch (err: any) {
      this.logger?.error("SELL_DELETE_FAILED", { err: err?.message });
      throw new AppError(
        "Failed to delete sell",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "SELL_DELETE_FAILED"
      );
    }
  }

  async confirmAll(): Promise<number> {
    try {
      const sells = await this.sellRepo.listByStatus("PENDING");

      for (const sell of sells) {
        this.logger.debug(
          `Pending Sell - ID: ${sell.id}, Product ID: ${sell.productId}, Price: ${sell.price}`
        );
        await this.sellRepo.updateStatusById(sell.productId, "SOLD");
      }
      const { count } = await this.sellRepo.updateManyStatusByStatus(
        "PENDING",
        "SOLD"
      );
      return count;
    } catch (error) {
      this.logger.error("CONFIRM_ALL_FAILED", { error });
      throw new AppError(
        "Failed to confirm all sells",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIRM_ALL_FAILED"
      );
    }
  }

  async getDashboardData(paramsYear?: string): Promise<dashboardResponse> {
    this.logger.debug(`Get Dashboard Data for year: ${paramsYear}`);
    try {
      const year = Number(paramsYear ?? new Date().getFullYear());
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      const [totalIncome, totalRepair, totalSales] = await Promise.all([
        this.sellRepo.getIcomeByDateRange(startDate, endDate),
        this.serviceRepo.countRepairsByDateRange(startDate, endDate),
        this.sellRepo.countSalesByDateRange(startDate, endDate),
      ]);
      return { totalIncome, totalRepair, totalSales };
    } catch (error) {
      this.logger.error("GET_DASHBOARD_FAILED", { error });
      throw new AppError(
        "Failed to get Dashboard",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "GET_DASHBOARD_FAILED"
      );
    }
  }

  async getHistory(): Promise<SellHistoryItem[]> {
    try {
      return await this.sellRepo.getHistoryByStatus("PAID");
    } catch (error) {
      this.logger.error("GET_HISTORY_FAILED", { error });
      throw new AppError(
        "Failed to get Hoistory",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "GET_HISTORY_FAILED"
      );
    }
  }

  async getInfo(id:string): Promise<Sell> {
    try {
      const sell = await this.sellRepo.findByIdAndStatus(id,"PAID");
      if (!sell) {
        throw new AppError(
          "Sell not found",
          StatusCodes.NOT_FOUND,
          ReasonPhrases.NOT_FOUND
        );
      }
      return sell;
    } catch (error) {
      this.logger.error("GET_SELL_INFO_FAILED", { error });
      throw new AppError(
        "Failed to get Sell info",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "GET_SELL_INFO_FAILED"
      );
    }
  }

}
