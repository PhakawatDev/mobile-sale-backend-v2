import { Prisma, PrismaClient, Product } from "@prisma/client";
import { SellDto } from "../sell/sell.dto";

export class ProductRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  createMany(
    data: Prisma.ProductCreateManyInput[]
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.product.createMany({ data });
  }

  findFirst(): Promise<Product | null> {
    return this.prisma.product.findFirst();
  }

  findManyByStatusInstock(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: "INSTOCK",
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  findManyPaged(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    return this.prisma.$transaction([
      this.prisma.product.count({ where: { status: "INSTOCK" } }),
      this.prisma.product.findMany({
        where: { status: "INSTOCK" },
        orderBy: { id: "desc" },
        skip: skip,
        take: pageSize,
      }),
    ]);
  }

  findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  updateById(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  deleteById(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }

  remove(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        status: "delete",
      },
    });
  }

  findWhere(data: SellDto): Promise<Product | null> {
    const { serial, productName } = data;
    const where: Prisma.ProductWhereInput = {
      status: 'INSTOCK',
      OR: [
        serial?.trim() ? { serial: serial.trim() } : undefined,
        productName?.trim() ? { name: productName.trim() } : undefined,
      ].filter(Boolean) as Prisma.ProductWhereInput[],
    };
    return this.prisma.product.findFirst({ where });
  }
}
