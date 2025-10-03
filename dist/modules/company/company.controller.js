"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const company_service_1 = require("./company.service");
const company_dto_1 = require("./company.dto");
const logger_1 = require("../../core/logger/logger");
class CompanyController {
    constructor() {
        // constructor(private service: CompanyService) { }
        this.logger = new logger_1.AppLogger(CompanyController);
        this.create = async (req, res, next) => {
            try {
                const dto = company_dto_1.UpsertCompanyDto.parse(req.body);
                const result = await this.service.upsertCompany(dto);
                res.json({ message: result ? 'success' : 'success', data: result });
            }
            catch (err) {
                next(err);
            }
        };
        this.get = async (req, res, next) => {
            try {
                const company = await this.service.getCompany();
                res.json({ data: company });
            }
            catch (err) {
                this.logger.error('COMPANY_GET_FAILED', { err: err.message });
                next(err);
            }
        };
        this.service = new company_service_1.CompanyService();
    }
}
exports.CompanyController = CompanyController;
