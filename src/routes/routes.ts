import { Router, Request, Response } from "express";
import { UserController } from "../controllers/index.js";
import { 
  validateRoute, 
  userRegistrationValidationChain, 
  userLoginValidationChain 
} from "../utils/validation/user.js";

export const router: Router = Router();

router.post("/register", userRegistrationValidationChain, validateRoute, UserController.registerNewUser);  
router.post("/login", userLoginValidationChain, validateRoute, UserController.login);
