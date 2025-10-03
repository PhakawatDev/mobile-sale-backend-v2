import { AppLogger } from "../../core/logger/logger";
import { UserService } from "./user.service";

export class UserController {
    private readonly log = new AppLogger(UserController);
    private readonly service: UserService;

    constructor(){
        this.service = new UserService();
    }
    
}