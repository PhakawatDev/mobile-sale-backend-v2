import { Router } from 'express';
import { UserController } from './user.controller';

const userCtrl = new UserController();

const userRouter = Router();

// userRouter.post("/signin", UserController.signIn);
// userRouter.get("/info", UserController.info);
// userRouter.put("/update", UserController.update);
// userRouter.get("/list", UserController.list);
// userRouter.post("/create", UserController.create);
// userRouter.put("/update/:id", UserController.updateRow);
// userRouter.delete("/remove/:id", UserController.remove);

export default userRouter ;