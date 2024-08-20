import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import { DeleteHandler, UpdateHandler } from "../controllers/user.controller";

const UserRoutes = Router();

UserRoutes.patch("/", AuthHandler, UpdateHandler);
UserRoutes.delete("/", AuthHandler, DeleteHandler);

export default UserRoutes;
