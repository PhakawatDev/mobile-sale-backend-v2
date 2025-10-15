import { Router } from 'express';
import { SellController } from './sell.controller';

const sellController = new SellController();

const sellRouter = Router();

sellRouter.post("/create", sellController.create);
sellRouter.get("/list", sellController.list);
sellRouter.delete("/remove/:id", sellController.remove);  
sellRouter.get("/confirm", sellController.confirm);
sellRouter.get("/dashboard/:year", sellController.dashboard);
sellRouter.get("/history", sellController.history);   
sellRouter.get("/info/:id", sellController.info); 

export default sellRouter ;