import { Router } from 'express';
import { UserController } from './user.controller';

const userController = new UserController();

const userRouter = Router();

userRouter.post("/signin", userController.signIn);
userRouter.get("/info", userController.info);
userRouter.put("/update", userController.update);
userRouter.get("/list", userController.list);
userRouter.post("/create", userController.create);
userRouter.put("/update/:id", userController.updateRow);
userRouter.delete("/remove/:id", userController.remove);

export default userRouter ;