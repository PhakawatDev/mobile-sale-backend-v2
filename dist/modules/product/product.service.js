"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../../core/db/prisma/prisma");
const AppError_1 = require("../../core/errors/AppError");
const logger_1 = require("../../core/logger/logger");
const product_repository_1 = require("./product.repository");
const XLSX = __importStar(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ProductService {
    constructor() {
        this.logger = new logger_1.AppLogger(ProductService);
        this.repo = new product_repository_1.ProductRepository(prisma_1.prisma);
    }
    async createProduct(payload) {
        const maskedPhone = payload.customerPhone?.replace(/(\d{3})\d+(\d{2})$/, '$1****$2') ?? '';
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
    }
    ;
    async getAllByStatusInstock() {
        const products = await this.repo.findManyByStatusInstock();
        this.logger.debug(`get Company: ${JSON.stringify(products, null, 2)}`);
        if (!products || products.length === 0) {
            throw new AppError_1.AppError('Company not found', 404, 'COMPANY_NOT_FOUND');
        }
        return products;
    }
    ;
    async findManyPaged(page, pageSize) {
        return this.repo.findManyPaged(page, pageSize);
    }
    async update(id, data) {
        return this.repo.updateById(id, data);
    }
    async remove(id) {
        return this.repo.remove(id);
    }
    async exportToExcel(data) {
        // validate input
        if (!Array.isArray(data) || data.length === 0) {
            throw new AppError_1.AppError('products must be a non-empty array', 400, 'BAD_REQUEST');
        }
        // กำหนดลำดับคอลัมน์ให้แน่นอน (header)
        const header = [
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
        const worksheet = XLSX.utils.json_to_sheet(rows, { header: header });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        // เตรียมโฟลเดอร์ /uploads
        const uploadsDir = path_1.default.resolve(process.cwd(), 'uploads');
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        const fileName = `products_${Date.now()}.xlsx`;
        const filePath = path_1.default.join(uploadsDir, fileName);
        XLSX.writeFile(workbook, filePath);
        return { fileName, path: `/uploads/${fileName}`, size: rows.length };
    }
}
exports.ProductService = ProductService;
