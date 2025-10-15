import { prisma } from "../../core/db/prisma/prisma";
import { AppError } from "../../core/errors/AppError";
import { AppLogger } from "../../core/logger/logger";
import { ExportRequestBody, Product, ProductInput, ProductUpdateDto } from "./product.dto";
import { ProductRepository } from "./product.repository";
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export class ProductService {
    private readonly logger = new AppLogger(ProductService);
    private readonly repo: ProductRepository;

    constructor() {
        this.repo = new ProductRepository();
    }

    async createProduct(payload: ProductInput) {
        const maskedPhone =
            payload.customerPhone?.replace(/(\d{3})\d+(\d{2})$/, '$1****$2') ?? '';

        this.logger.debug('CREATE_PRODUCT', {
            product: {
                serial: payload.serial,
                name: payload.name,
                price: payload.price,
                customerName: payload.customerName,
                customerPhone: maskedPhone,
            },
        });

        return this.repo.create({
            release: payload.release,
            name: payload.name,
            color: payload.color,
            price: payload.price,
            customerName: payload.customerName,
            customerAddress: payload.customerAddress,
            customerPhone: payload.customerPhone,
            remark: payload.remark ?? '',
            serial: payload.serial,
        });
    };

    async getAllByStatusInstock() {
        const products = await this.repo.findManyByStatusInstock();
        this.logger.debug(`get Company: ${JSON.stringify(products, null, 2)}`);

        if (!products || products.length === 0) {
            throw new AppError('Company not found', 404, 'COMPANY_NOT_FOUND');
        }
        return products;
    };

    async findManyPaged(page: number, pageSize: number) {
        return this.repo.findManyPaged(page, pageSize)
    }

    async update(id: string, data: ProductUpdateDto) {
        return this.repo.updateById(id, data);
    }

    async remove(id: string) {
        return this.repo.remove(id);
    }

    async exportToExcel(data: Product[]) {
        // validate input
        if (!Array.isArray(data) || data.length === 0) {
            throw new AppError('products must be a non-empty array', 400, 'BAD_REQUEST');
        }

        // กำหนดลำดับคอลัมน์ให้แน่นอน (header)
        const header: (keyof Product)[] = [
            'id',
            'serial',
            'name',
            'release',
            'color',
            'price',
            'customerName',
            'customerPhone',
            'customerAddress',
            'remark',
        ];

        // จัดรูปก่อนลงไฟล์
        const rows = data.map((p) => ({
            id: p.id,
            serial: p.serial ?? '',
            name: p.name,
            release: p.release,
            color: p.color,
            price: p.price,
            customerName: p.customerName,
            customerPhone: p.customerPhone,
            customerAddress: p.customerAddress ?? '',
            remark: p.remark ?? '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows, { header: header as string[] });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // เตรียมโฟลเดอร์ /uploads
        const uploadsDir = path.resolve(process.cwd(), 'uploads');
        fs.mkdirSync(uploadsDir, { recursive: true });

        const fileName = `products_${Date.now()}.xlsx`;
        const filePath = path.join(uploadsDir, fileName);

        XLSX.writeFile(workbook, filePath);

        return { fileName, path: `/uploads/${fileName}`, size: rows.length };
    }
}
