import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import {
    DeleteHandler,
    FindManyHandler,
    UpdateHandler,
} from "../controllers/user.controller";

const UserRoutes = Router();

UserRoutes.get("/", AuthHandler, FindManyHandler);
UserRoutes.patch("/", AuthHandler, UpdateHandler);
UserRoutes.delete("/", AuthHandler, DeleteHandler);

export default UserRoutes;
