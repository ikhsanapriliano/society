import { Router } from "express";
import { AuthHandler } from "../middlewares/auth.middelware";
import {
    DeleteHandler,
    FindManyHandler,
    UpdateBioHandler,
    UpdatePhotoHandler,
} from "../controllers/user.controller";

const UserRoutes = Router();

UserRoutes.get("/", AuthHandler, FindManyHandler);
UserRoutes.patch("/photo", AuthHandler, UpdatePhotoHandler);
UserRoutes.patch("/bio", AuthHandler, UpdateBioHandler);
UserRoutes.delete("/", AuthHandler, DeleteHandler);

export default UserRoutes;
