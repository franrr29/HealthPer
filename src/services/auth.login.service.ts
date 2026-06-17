//Loggear usuario, buscar en db si existe y firmar con JWT:

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { conexionDB } from "../config/db";
import { logger } from "../config/logger";
import { env } from "../config/env";
import { RowDataPacket } from "mysql2/promise";


async function loginUser(email: string, password: string) {

    try {

        const [rows] = await conexionDB.query<RowDataPacket[]>(
            "SELECT * FROM doctors WHERE email= ?",
            [email]
        );


        //verificar mail que existe:
        if (rows.length === 0) {
            throw new Error("Invalid credentials to login")
        }


        const doctor = rows[0];


        //comparar contraseñas:
        const validPassword = await bcrypt.compare(
            password,
            doctor.password_hash
        );


        if (!validPassword) {
            throw new Error("Invalid credentials")
        }


        //Si existe en base de datos firmo con JWT:

        const token = jwt.sign(
            { id: doctor.id, email: doctor.email },
            env.JWT_SECRET,
            { expiresIn: "1d" }
        );


        logger.info(
            `Doctor logged successfully | Email: ${email}`
        );


        // Eliminar password_hash antes de retornar al cliente:
        delete doctor.password_hash;

        return {
            doctor,
            token
        }


    } catch (error) {

        throw error

    }
};

export default loginUser;