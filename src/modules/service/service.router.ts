import { Router } from "express";
import { ServiceController } from "./service.controller";

const serviceController = new ServiceController(); 
const serviceRouter = Router();

serviceRouter.post("/create", serviceController.create);
serviceRouter.get("/list", serviceController.list);
serviceRouter.put("/update/:id", serviceController.update);
serviceRouter.delete("/remove/:id", serviceController.remove);

export default serviceRouter;