import { Router, Request, Response } from "express";
import { UserController } from "../controllers/index.js";
import {
  validateRoute, 
  userRegistrationValidationChain, 
  userLoginValidationChain 
} from "../utils/index.js";
import {Token} from "../controllers/index.js";

export const router: Router = Router();

router.post("/register", userRegistrationValidationChain, validateRoute, UserController.registerNewUser);
router.post("/login", userLoginValidationChain, validateRoute, UserController.login);

router.post("/token/refresh", Token.verifyAndRefreshToken);