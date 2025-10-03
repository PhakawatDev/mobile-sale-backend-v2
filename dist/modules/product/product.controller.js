"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const logger_1 = require("../../core/logger/logger");
const product_service_1 = require("./product.service");
const product_dto_1 = require("./product.dto");
const response_1 = require("../../core/http/response");
const AppError_1 = require("../../core/errors/AppError");
class ProductController {
    constructor() {
        this.logger = new logger_1.AppLogger(ProductController);
        this.create = async (req, res, next) => {
            this.logger.debug('PRODUCT_CREATE...');
            try {
                const dto = product_dto_1.CreateProductDto.parse(req.body);
                const { qty, ...product } = dto;
                if (qty > 1000) {
                    res.status(400).json({ error: "qty must be less than 1000" });
                    return;
                }
                for (let i = 0; i < qty; i++) {
                    await this.service.createProduct(product);
                }
                return (0, response_1.created)(res, req, null, { message: 'create product success' });
            }
            catch (error) {
                this.logger.error('PRODUCT_CREATE_FAILED', {
                    err: error.message,
                });
                return (0, response_1.fail)(res, req, 'Failed to create product', 400, { code: 'PRODUCT_CREATE_FAILED', details: error.message });
            }
        };
        this.listsInstock = async (req, res, next) => {
            this.logger.debug('PRODUCT_GET_LIST...');
            try {
                const products = await this.service.getAllByStatusInstock();
                return (0, response_1.ok)(res, req, products);
            }
            catch (error) {
                this.logger.error('PRODUCT_GET_LIST_FAILED', { err: error.message });
                return (0, response_1.fail)(res, req, error.message, 500, { code: error.statusCode });
            }
        };
        this.listsInstockPaged = async (req, res) => {
            try {
                const page = Math.max(1, Number(req.params.page) || 1);
                const pageSize = Math.min(100, Math.max(1, Number(req.params.pageSize) || 5));
                const [total, rows] = await this.service.findManyPaged(page, pageSize);
                const totalPages = Math.ceil(total / pageSize);
                return (0, response_1.paged)(res, req, rows, { page, pageSize, total, totalPages });
            }
            catch (error) {
                this.logger.error('PRODUCT_GET_LIST_Paged_FAILED', { err: error.message });
                return (0, response_1.fail)(res, req, error.message, 500, { code: error.statusCode });
            }
        };
        this.update = async (req, res) => {
            this.logger.debug(`update params Id :: ${req.params.id}`);
            try {
                const result = await this.service.update(req.params.id, req.body);
                return (0, response_1.ok)(res, req, result);
            }
            catch (error) {
                this.logger.error('PRODUCT_UPDATE_FAILED', { err: error.message });
                return (0, response_1.fail)(res, req, error.message, 500, { code: error.statusCode });
            }
        };
        this.remove = async (req, res) => {
            this.logger.debug(`remove params Id :: ${req.params.id}`);
            try {
                const result = await this.service.remove(req.params.id);
                return (0, response_1.ok)(res, req, result, { message: 'remove success' });
            }
            catch (error) {
                this.logger.error('PRODUCT_CREATE_FAILED', {
                    err: error.message,
                });
                return (0, response_1.fail)(res, req, `Failed to remove product id :: ${req.params.id}`, 400, { code: 'PRODUCT_REMOVE_FAILED', details: error.message });
            }
        };
        this.exportToExcel = async (req, res) => {
            this.logger.debug("Exporting products to Excel...");
            try {
                const { products } = req.body;
                const result = await this.service.exportToExcel(products);
                return (0, response_1.ok)(res, req, result, { message: 'export success' });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                const status = error instanceof AppError_1.AppError ? error.statusCode : 500;
                const code = error instanceof AppError_1.AppError ? error.code : 'PRODUCT_EXPORT_FAILED';
                return (0, response_1.fail)(res, req, 'Failed to export products', status, {
                    code,
                    details: message,
                });
            }
        };
        this.service = new product_service_1.ProductService();
    }
}
exports.ProductController = ProductController;
