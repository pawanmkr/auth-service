import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import path from "path";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { QueryResultRow } from "pg";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET_KEY;
if (JWT_SECRET_KEY === undefined) {
  throw new Error("JWT_SECRET NOT FOUND");
}

export class UserController {
  static async registerNewUser(req: Request, res: Response) {
    const { user_type, first_name, last_name, username, email, password } = req.body;
    const hashedPassword: string = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");

    const existingUser: boolean = await User.doesEmailAlreadyExists(email);
    if (existingUser) {
      return res.status(409).send("Email Already Exists! Please Login");
    }
    const usernameOccupied: boolean = await User.doesUserAlreadyExists(username);
    if (usernameOccupied) {
      return res.status(409).send(`Please choose another username, ${username} is not available`);
    }
    const registeredUser: QueryResultRow = await User.registerNewUser(
      user_type,
      first_name,
      last_name,
      username,
      email,
      hashedPassword
    );
    const payload: JwtPayload = {
      id: registeredUser.user_id,
      user_type: registeredUser.user_type
    };
    const token: string = jwt.sign(payload, JWT_SECRET_KEY);
    return res.status(201).json({
      message: `User Registered with Id:${registeredUser.user_id}`,
      token: token,
    });
  }

  static async login(req: Request, res: Response) {
    const { username, email, password } = req.body;
    if (!username && !email) {
      return res.status(400).json({ error: 'Username or Email is required' });
    }

    const existingUser: QueryResultRow = await User.findExistingUser(username, email)
    if (!existingUser) {
      return res.status(404).send("User does not exists! Please Signup");
    }

    const hashedPassword: string = crypto
      .createHash("sha512")
      .update(password)
      .digest("hex");
    if (existingUser.password !== hashedPassword) {
      return res.status(404).send("username or passowrd is incorrect");
    }

    const payload: JwtPayload = {
      id: existingUser.user_id,
      user_type: existingUser.user_type
    };
    const token: string = jwt.sign(payload, JWT_SECRET_KEY);
    return res.status(201).json({
      message: `Login Succesfull`,
      token: token,
    });
  }
}
