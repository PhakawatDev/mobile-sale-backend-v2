import { NextFunction, Request, Response } from "express";
import { AppLogger } from "../../core/logger/logger";
import { ProductService } from "./product.service";
import { CreateProductDto, ExportRequestBody, Product, ProductUpdateDto } from "./product.dto";
import { created, fail, ok, paged } from "../../core/http/response";
import { AppError } from "../../core/errors/AppError";

export class ProductController {

    private readonly logger = new AppLogger(ProductController);
    private readonly service: ProductService;

    constructor() {
        this.service = new ProductService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        this.logger.debug('PRODUCT_CREATE...')
        try {
            const dto = CreateProductDto.parse(req.body);
            const { qty, ...product } = dto;

            if (qty > 1000) {
                res.status(400).json({ error: "qty must be less than 1000" })
                return;
            }

            for (let i = 0; i < qty; i++) {
                await this.service.createProduct(product);
            }

            return created(res, req, null, { message: 'create product success' });

        } catch (error) {
            this.logger.error('PRODUCT_CREATE_FAILED', {
                err: (error as Error).message,
            });
            return fail(res, req, 'Failed to create product', 400, { code: 'PRODUCT_CREATE_FAILED', details: (error as Error).message });
        }
    };

    listsInstock = async (req: Request, res: Response, next: NextFunction) => {
        this.logger.debug('PRODUCT_GET_LIST...')
        try {
            const products = await this.service.getAllByStatusInstock();

            return ok(res, req, products);
        } catch (error: any) {
            this.logger.error('PRODUCT_GET_LIST_FAILED', { err: (error as Error).message });
            return fail(res, req, error.message, 500, { code: error.statusCode });
        }
    }

    listsInstockPaged = async (req: Request, res: Response) => {
        try {
            const page = Math.max(1, Number(req.params.page) || 1);
            const pageSize = Math.min(100, Math.max(1, Number(req.params.pageSize) || 5));

            const [total, rows] = await this.service.findManyPaged(page, pageSize);
            const totalPages = Math.ceil(total / pageSize);

            return paged(res, req, rows, { page, pageSize, total, totalPages });

        } catch (error: any) {
            this.logger.error('PRODUCT_GET_LIST_Paged_FAILED', { err: (error as Error).message });
            return fail(res, req, error.message, 500, { code: error.statusCode });
        }
    }

    update = async (req: Request<{ id: string }, {}, ProductUpdateDto>, res: Response) => {
        this.logger.debug(`update params Id :: ${req.params.id}`)
        try {
            const result = await this.service.update(req.params.id, req.body);
            return ok(res, req, result);
        } catch (error: any) {
            this.logger.error('PRODUCT_UPDATE_FAILED', { err: (error as Error).message });
            return fail(res, req, error.message, 500, { code: error.statusCode });
        }
    };

    remove = async (req: Request<{ id: string }>, res: Response) => {
        this.logger.debug(`remove params Id :: ${req.params.id}`)
        try {
            const result = await this.service.remove(req.params.id);
            return ok(res, req, result, { message: 'remove success' });
        } catch (error) {
            this.logger.error('PRODUCT_CREATE_FAILED', {
                err: (error as Error).message,
            });
            return fail(res, req, `Failed to remove product id :: ${req.params.id}`, 400, { code: 'PRODUCT_REMOVE_FAILED', details: (error as Error).message });
        }
    };

    exportToExcel = async (req: Request<{}, {}, ExportRequestBody>, res: Response) => {
        this.logger.debug("Exporting products to Excel...");
        try {
            const { products } = req.body;

            const result = await this.service.exportToExcel(products);

            return ok(res, req, result, { message: 'export success' });

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            const status = error instanceof AppError ? error.statusCode : 500;
            const code = error instanceof AppError ? error.code : 'PRODUCT_EXPORT_FAILED';
            return fail(res, req, 'Failed to export products', status, {
                code,
                details: message,
            });
        }

    }
}