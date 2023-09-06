import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { Token, returnError, hashPassword } from "../utils/index.js";
import { User, Password } from "../models/index.js";

const TOKEN_LENGTH = 32;

export async function generatePasswordResetToken(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;
  const emailExists: boolean = await User.doesEmailAlreadyExists(email);
  if (!emailExists) {
    return res.status(404).json({
      error: `User does not with ${email}`
    });
  }
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  const expiry = Token.generateEpochTimestampInHours(24);
  Password.registerResetRequest(email, token, expiry);

  // send token with magic link

  res.status(201).json({
    reset_token: token
  });
  next();
}

export async function confirmPasswordReset(req: Request, res: Response, next: NextFunction) {
  const { password, confirm_password, reset_token } = req.body;
  if (password !== confirm_password) {
    return returnError(res, 400, "Entered passwords do not match");
  }

  const result = await Password.findResetRequestByToken(reset_token);
  if (!result) {
    return returnError(res, 404, "Invalid token provided");
  }

  const now = new Date();
  if (now.getTime() > result.expiry) {
    return returnError(res, 406, "Link expired! Please try again");
  }

  const user = await User.findExistingUser(null, result.email);
  if (!user) {
    return returnError(res, 500, "Internal Server Error");
  }

  await User.updatePassword(user.user_id, hashPassword(password));
  await Password.deleteResetRequest(user.email);
  res.status(201).json({
    message: "Password changed Succesfully"
  });
  next();
}