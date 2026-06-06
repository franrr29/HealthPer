
// Extiende request de express para incluir a user después de que auth.middleware valida el token

import "express";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}