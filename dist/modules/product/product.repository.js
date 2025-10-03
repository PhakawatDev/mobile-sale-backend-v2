"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
class ProductRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        return this.prisma.product.create({ data });
    }
    createMany(data) {
        return this.prisma.product.createMany({ data });
    }
    findFirst() {
        return this.prisma.product.findFirst();
    }
    findManyByStatusInstock() {
        return this.prisma.product.findMany({
            where: {
                status: 'INSTOCK'
            },
            orderBy: {
                id: 'desc',
            }
        });
    }
    findManyPaged(page, pageSize) {
        const skip = (page - 1) * pageSize;
        return this.prisma.$transaction([
            this.prisma.product.count({ where: { status: 'INSTOCK' } }),
            this.prisma.product.findMany({
                where: { status: 'INSTOCK' },
                orderBy: { id: 'desc' },
                skip: skip,
                take: pageSize,
            }),
        ]);
    }
    findById(id) {
        return this.prisma.product.findUnique({ where: { id } });
    }
    updateById(id, data) {
        return this.prisma.product.update({ where: { id }, data });
    }
    deleteById(id) {
        return this.prisma.product.delete({ where: { id } });
    }
    remove(id) {
        return this.prisma.product.update({
            where: { id },
            data: {
                status: "delete"
            }
        });
    }
}
exports.ProductRepository = ProductRepository;
