import { Prisma } from "@prisma/client";
import { Request } from "express";

export interface SellDto {
  serial: string;
  productName: string;
  price: number;
  productId: string;
}

export type UpdateSellRequest = Request<{}, any, SellDto>;

export interface dashboardResponse {
  totalIncome: number;
  totalRepair: number;
  totalSales: number;
}

export type SellHistoryItem = Prisma.SellGetPayload<{
  include: { product: { select: { serial: true; name: true } } };
}>;

export type SellWithProduct = Prisma.SellGetPayload<{
  include: { product: true };
}>;
