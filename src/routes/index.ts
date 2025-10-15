import { Router } from 'express';
import productRouter from '../modules/product/product.router';
import companyRouter from '../modules/company/company.router';
import userRouter from '../modules/user/user.router';
import serviceRouter from '../modules/service/service.router';
import sellRouter from '../modules/sell/sell.router';

export const router = Router();

router.use('/company', companyRouter);
router.use('/buy', productRouter);
router.use('/user',userRouter)
router.use('/service',serviceRouter);
router.use('/sell',sellRouter)