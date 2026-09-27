import mysql2 from "mysql2/promise"
import type { PoolConnection } from "mysql2/promise"
import { env } from "./env";

export const conexionDB = mysql2.createPool({
    port: env.DB_PORT,
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: true, ca: env.DB_CA_CERT } : undefined
})

export async function withTransaction<T>(work: (connection: PoolConnection) => Promise<T>): Promise<T> {
    const connection = await conexionDB.getConnection();

    try {
        await connection.beginTransaction();

        const result = await work(connection);

        await connection.commit();

        return result;
    } catch (error) {
        await connection.rollback();

        throw error;
    } finally {
        connection.release();
    }
}
