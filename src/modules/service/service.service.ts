import { Prisma, Service } from "@prisma/client";
import { AppLogger } from "../../core/logger/logger";
import { ServiceRepository } from "./service.repository";
import { ServiceDto } from "./service.dto";

export class ServiceService {
    private readonly logger = new AppLogger(ServiceService);
    private readonly serviceRepo: ServiceRepository;
  
    constructor() {
      this.serviceRepo = new ServiceRepository();
    }

    async create(payload: ServiceDto): Promise<Service> {
        const data: Prisma.ServiceCreateInput = {
            name: payload.name,
            price: payload.price,
            remark: payload.remark,
        }
        return this.serviceRepo.create(data);
    };

    async getAllList(): Promise<Service[]>{
        return this.serviceRepo.getLists();
    };

    async update(id:string,payload: ServiceDto): Promise<Service> {
        const data: Prisma.ServiceUpdateInput = {
            name: payload.name,
            price: payload.price,
            remark: payload.remark,
        }
        return this.serviceRepo.updateById(id,data);
    };

    async remove(id:string): Promise<Service>{
        return this.serviceRepo.deleteById(id);
    };



}