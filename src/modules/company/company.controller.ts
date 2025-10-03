import { Request, Response, NextFunction } from 'express';
import { CompanyService } from './company.service';
import { UpsertCompanyDto } from './company.dto';
import { AppLogger } from '../../core/logger/logger';

export class CompanyController {
    // constructor(private service: CompanyService) { }
    private readonly logger = new AppLogger(CompanyController);
    private readonly service: CompanyService;

    constructor(){
        this.service = new CompanyService();
    }
    
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = UpsertCompanyDto.parse(req.body);
            const result = await this.service.upsertCompany(dto);
            res.json({ message: result ? 'success' : 'success', data: result });
        } catch (err) {
            next(err);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const company = await this.service.getCompany();
            res.json({ data: company });
        } catch (err) {
            this.logger.error('COMPANY_GET_FAILED', { err: (err as Error).message });
            next(err);
        }
    };
}
