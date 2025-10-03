import { Router } from 'express';
import { ProductController } from './product.controller';

const controller = new ProductController();

const router = Router();

router.get('/listsInstock', controller.listsInstock);
router.get('/listsPageSize/:page/:pageSize', controller.listsInstockPaged);
router.put('/update/:id', controller.update);
router.put('/remove/:id', controller.remove);
router.post('/export', controller.exportToExcel);

export default router;
