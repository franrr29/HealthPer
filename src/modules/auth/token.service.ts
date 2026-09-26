import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import type { AccessTokenPayload, RefreshTokenPayload } from "../../types/auth.types";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}
