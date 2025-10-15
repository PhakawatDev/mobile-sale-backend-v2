import { Prisma, PrismaClient, Service } from "@prisma/client";
import { ServiceDto } from "./service.dto";
import { AppLogger } from "../../core/logger/logger";
import { AppError } from "../../core/errors/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class ServiceRepository {
  private readonly prisma: PrismaClient;
  private readonly logger = new AppLogger(ServiceRepository);

  constructor() {
    this.prisma = new PrismaClient();
  }

  create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return this.prisma.service.create({ data });
  }

  getLists(): Promise<Service[]> {
    return this.prisma.service.findMany({
      orderBy: { payDate: "desc" },
    });
  };

  updateById(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    this.logger.debug(`Update Service id=${id}`);
    this.logger.debug(`Update Service payload= ${JSON.stringify(data,null,2)}`)
    try {
        return this.prisma.service.update({ where: { id }, data });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            this.logger.warn(`Service not found id=${id}`);
            throw new AppError(`Service with id ${id} not found`, 404, 'SERVICE_NOT_FOUND');
          }
          this.logger.error(`Update failed id=${id}: ${(error as Error).message}`);
          throw new AppError('Failed to update service', 500, 'SERVICE_UPDATE_FAILED');
        }
    };

    async deleteById(id: string): Promise<Service> {
        this.logger.debug(`Delete Service id=${id}`);
        try {
          const deleted = await this.prisma.service.delete({ where: { id } });

          this.logger.debug(`Deleted Service id=${id}`);

          return deleted;
        } catch (err) {
          if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            this.logger.warn(`Service not found id=${id}`);
            throw new AppError(`Service with id ${id} not found`, 404, 'SERVICE_NOT_FOUND');
          }
          this.logger.error(`Delete failed id=${id}: ${(err as Error).message}`);
          throw new AppError('Failed to delete service', 500, 'SERVICE_DELETE_FAILED');
        }
    };

    countRepairsByDateRange(staryDate: Date, endDate: Date): Promise<number> {
      this.logger.debug(`Counting repairs between: ${staryDate} and ${endDate}`);
      return this.prisma.service.count({
        where: { payDate: { gte: staryDate, lte: endDate }, },
      });
    }


}
