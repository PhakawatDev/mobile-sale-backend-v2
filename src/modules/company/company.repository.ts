import { PrismaClient, Company } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export class CompanyRepository {
    // constructor(private prisma: PrismaClient) { }
    private readonly prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }
    
    findFirst() {
        return this.prisma.company.findFirst();
    }

    findById(id: string) {
        return this.prisma.company.findUnique({ where: { id } });
    }

    create(data: Prisma.CompanyCreateInput): Promise<Company> {
        return this.prisma.company.create({ data });
    }

    updateById(id: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
        return this.prisma.company.update({ where: { id }, data });
    }
}
