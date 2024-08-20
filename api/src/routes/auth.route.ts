import { Router } from "express";
import { LoginHandler, RegisterHandler } from "../controllers/auth.controller";

const AuthRoutes = Router();

AuthRoutes.post("/register", RegisterHandler);
AuthRoutes.post("/login", LoginHandler);

export default AuthRoutes;
