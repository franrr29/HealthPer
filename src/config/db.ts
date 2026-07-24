import mysql2 from "mysql2/promise"
import { env } from "./env";

export const conexionDB = mysql2.createPool({
    port: env.DB_PORT,
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
})