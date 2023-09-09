import { Router } from "express";
import { InputValidation } from "../utils/index.js";
import { 
  UserController, 
  generatePasswordResetToken, 
  verifyAndRefreshToken, 
  confirmPasswordReset, 
  sendEmailVerificationLink, 
  confirmEmailVerification, 
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  archiveUserProfile
} from "../controllers/index.js";
import authorization from "../middlewares/auth.js";

export const router: Router = Router();

router.post("/register", InputValidation.validateUserRegistration, UserController.registerNewUser);
router.post("/login", InputValidation.validateUserLogin, UserController.login);

router.post("/token/refresh", verifyAndRefreshToken);

router.post("/password/reset/request", InputValidation.validateEmail, generatePasswordResetToken);
router.post("/password/reset/confirm", InputValidation.validatePassword, confirmPasswordReset);

router.post("/email/verify/request", InputValidation.validateEmail, sendEmailVerificationLink);
router.get("/email/verify/confirm", confirmEmailVerification);


/* PROTECTED ROUTES */
router.get("/user/profile", authorization, getUserProfile);
router.put("/user/profile", InputValidation.validateUserUpdate, authorization, updateUserProfile);
router.put("/user/profile/archive", InputValidation.validateArchivedBy, authorization, archiveUserProfile);
router.delete("/user/profile", authorization, deleteUserProfile);