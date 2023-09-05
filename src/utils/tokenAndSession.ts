import jwt, { JwtPayload } from "jsonwebtoken";
import { Session } from "../models/index.js";
import { Tokens } from "../types/index.js";

export function generateAccessToken(userId: number, userType: string, privateKey: string): string {
  const payload: JwtPayload = {
    user_id: userId,
    user_type: userType
  };
  return jwt.sign(payload, privateKey, {
    expiresIn: '1h'
  });  
}

export function generateRefreshToken(userId: number, privateKey: string): string {
  return jwt.sign({ user_id: userId  }, privateKey, {
    expiresIn: '365d'
  });  
}

export async function createNewSession(id: number, userType: string, privateKey: string): Promise<Tokens> {
  const accessToken = generateAccessToken(id, userType, privateKey);
  const refreshToken = generateRefreshToken(id, privateKey);
  
  /* 
   * Creating a timestamp in Epoch format of 1 year in future from now
   * i.e. the expiry time of refresh token generated in respective token
   */
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() + 1);
  const futureTimeStamp = currentDate.getTime()
  
  // saving session details to db
  await Session.grantNewSession(refreshToken, futureTimeStamp, id);

  return {
    accessToken,
    refreshToken,
  }
}