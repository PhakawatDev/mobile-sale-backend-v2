import { Router } from 'express';
import productRouter from '../modules/product/product.router';
import companyRouter from '../modules/company/company.router';
import userRouter from '../modules/user/user.router';

export const router = Router();


router.use('/company', companyRouter);
router.use('/buy', productRouter);
router.use('/user',userRouter)
