import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import {
    DeleteHandler,
    FindByIdHandler,
    FindManyHandler,
    UpdateBioHandler,
    UpdatePhotoHandler,
} from "../controllers/user.controller";

const UserRoutes = Router();

UserRoutes.get("/", AuthHandler, FindManyHandler);
UserRoutes.get("/profile", AuthHandler, FindByIdHandler);
UserRoutes.patch("/photo", AuthHandler, UpdatePhotoHandler);
UserRoutes.patch("/bio", AuthHandler, UpdateBioHandler);
UserRoutes.delete("/", AuthHandler, DeleteHandler);

export default UserRoutes;
