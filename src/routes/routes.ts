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

export const router: Router = Router();

router.post("/register", InputValidation.validateUserRegistration, UserController.registerNewUser);
router.post("/login", InputValidation.validateUserLogin, UserController.login);

router.post("/token/refresh", verifyAndRefreshToken);

router.post("/password/reset/request", InputValidation.validateEmail, generatePasswordResetToken);
router.post("/password/reset/confirm", InputValidation.validatePassword, confirmPasswordReset);

router.post("/email/verify/request", InputValidation.validateEmail, sendEmailVerificationLink);
router.get("/email/verify/confirm", confirmEmailVerification);

router.get("/user/profile", getUserProfile);
router.put("/user/profile", InputValidation.validateUserUpdate, updateUserProfile);
router.put("/user/profile/archive", InputValidation.validateArchivedBy, archiveUserProfile);
router.delete("/user/profile", deleteUserProfile);