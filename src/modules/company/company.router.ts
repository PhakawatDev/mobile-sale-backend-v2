import { Router } from 'express';
import { CompanyController } from './company.controller';

// const prisma = new PrismaClient();                
// const repo = new CompanyRepository();
// const svc = new CompanyService();
const ctrl = new CompanyController();

const companyRouter = Router();

companyRouter.post('/create', ctrl.create);
companyRouter.get('/list', ctrl.get);

export default companyRouter;
