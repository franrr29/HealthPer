// Opciones de cookies compartidas entre login, demo, google auth y refresh.
// sameSite "none" + secure es obligatorio para que la cookie viaje entre
// dominios distintos (frontend en healthper.online, backend en onrender.com).
// En development se usa "lax" porque "none" exige Secure, y localhost corre en http.

import { env } from "./env";

const isProd = env.NODE_ENV === "production";

export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge: 15 * 60 * 1000,
};

export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const clearCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
};
