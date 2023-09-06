import { Router, Request, Response } from "express";
import { InputValidation } from "../utils/index.js";
import { UserController, generatePasswordResetToken, verifyAndRefreshToken, confirmPasswordReset } from "../controllers/index.js";

export const router: Router = Router();

router.post("/register", InputValidation.validateUserRegistration, UserController.registerNewUser);
router.post("/login", InputValidation.validateUserLogin, UserController.login);

router.post("/token/refresh", verifyAndRefreshToken);

router.post("/password/reset/request", InputValidation.validateEmail, generatePasswordResetToken);
router.post("/password/reset/confirm", InputValidation.validatePassword, confirmPasswordReset);