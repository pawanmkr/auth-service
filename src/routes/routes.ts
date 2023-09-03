import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { UserController } from "../controllers/index.js";

export const router: Router = Router();

router.post("/user/register", UserController.registerNewUser);
router.post("/user/login", UserController.login);