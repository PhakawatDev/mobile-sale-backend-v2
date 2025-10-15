import { Prisma, PrismaClient, Sell } from "@prisma/client";
import { AppLogger } from "../../core/logger/logger";
import { SellHistoryItem, SellWithProduct } from "./sell.dto";

export class SellRepository {
  private readonly prisma: PrismaClient;
  private readonly logger = new AppLogger(SellRepository);

  constructor() {
    this.prisma = new PrismaClient();
  }

  create(data: Prisma.SellCreateInput): Promise<Sell> {
    return this.prisma.sell.create({ data });
  }

  listByStatus(status: string): Promise<Sell[]> {
    this.logger.debug(`Listing sells with status: ${status}`);
    return this.prisma.sell.findMany({
      where: { status },
      orderBy: { id: "desc" },
      include: {
        product: {
          select: { id:true, serial: true, name: true },
        },
      },
    });
  }

  deleteById(id: string): Promise<Sell> {
    this.logger.debug(`Deleting sell with id: ${id}`);
    return this.prisma.sell.delete({ where: { id } });
  }

  updateStatusById(id: string, status: string): Promise<Sell> {
    this.logger.debug(
      `Updating sell status with id: ${id} to status: ${status}`
    );
    return this.prisma.sell.update({ data: { status }, where: { id } });
  }

  updateManyStatusByStatus(
    oldStatus: string,
    newStatus: string
  ): Promise<Prisma.BatchPayload> {
    this.logger.debug(
      `Updating sells status from: ${oldStatus} to status: ${newStatus}`
    );
    return this.prisma.sell.updateMany({
      where: { status: oldStatus },
      data: { status: newStatus, payDate: new Date() },
    });
  }

  async getIcomeByDateRange(startDate: Date, endDate: Date): Promise<number> {
    this.logger.debug(
      `Calculating income from sells between: ${startDate} and ${endDate}`
    );
    const result = await this.prisma.sell.aggregate({
      _sum: { price: true },
      where: {
        status: "PAID",
        payDate: { gte: startDate, lte: endDate },
      },
    });
    return result._sum.price || 0;
  }

  countSalesByDateRange(staryDate: Date, endDate: Date): Promise<number> {
    this.logger.debug(`Counting repairs between: ${staryDate} and ${endDate}`);
    return this.prisma.sell.count({
      where: {
        status: "PAID",
        payDate: {
          gte: staryDate,
          lte: endDate,
        },
      },
    });
  }

  getHistoryByStatus(status: string): Promise<SellHistoryItem[]> {
    this.logger.debug(`Getting sell history with status: ${status}`);
    return this.prisma.sell.findMany({
      where: { status },
      orderBy: { payDate: "desc" },
      include: {
        product: {
          select: { serial: true, name: true },
        },
      },
    });
  }

  findByIdAndStatus(id: string, status: string): Promise<SellWithProduct> {
    this.logger.debug(`Finding sell with id: ${id} and status: ${status}`);
    return this.prisma.sell.findFirstOrThrow({
      where: { id, status },
      include: {
        product: true,
      },
    });
  }
}
