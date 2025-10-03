"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const client_1 = require("@prisma/client");
class CompanyRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    findFirst() {
        return this.prisma.company.findFirst();
    }
    findById(id) {
        return this.prisma.company.findUnique({ where: { id } });
    }
    create(data) {
        return this.prisma.company.create({ data });
    }
    updateById(id, data) {
        return this.prisma.company.update({ where: { id }, data });
    }
}
exports.CompanyRepository = CompanyRepository;
