import { Request } from "express";

export interface ServiceDto {
    name: string;
    price: number;
    remark?: string;
}

export type CreateServiceRequest = Request<{id:string}, any, ServiceDto>;