//Loggear usuario, buscar en db si existe y firmar con JWT:

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { conexionDB } from "../config/db";
import { logger } from "../config/logger";
import { env } from "../config/env";
import { RowDataPacket } from "mysql2/promise";
import { AppError } from "../errors/appError";


//Funcion para logear usuario en TryDemo sin pasarle email y password, solo para front de prueba:

async function tryDemoService (){

    //Buscar usuario demo en base de datos:
    const [rows] = await conexionDB.query<RowDataPacket[]>(
        "SELECT * FROM doctors WHERE email= ?",
        ["demo@demo.com"]
    );

    if (rows.length === 0) {
        throw new AppError("Demo user not found", 404);
    }

    const doctor = rows[0];

    // Si existe en base de datos, firmo con JWT:
    const token = jwt.sign(
        { id: doctor.id, email: doctor.email, role: doctor.role },
        env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: doctor.id, email: doctor.email, role: doctor.role },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    logger.info(`Demo user logged successfully | Email: ${doctor.email}`);

    // Eliminar password_hash antes de retornar al cliente:
    delete doctor.password_hash;

    return {
        doctor,
        token,
        refreshToken
    };
}



//Funcion para logear usuario ya registrado:
async function loginUser(email: string, password: string) {


    const [rows] = await conexionDB.query<RowDataPacket[]>(
        "SELECT * FROM doctors WHERE email= ?",
        [email]
    );


    //verificar mail que existe:
    if (rows.length === 0) {

        throw new AppError(

            "Invalid credentials",
            401
        );

    }


    const doctor = rows[0];


    //comparar contraseñas:
    const validPassword = await bcrypt.compare(
        password,
        doctor.password_hash
    );


    if (!validPassword) {

        throw new AppError(

            "Invalid credentials",
            401
        );

    }


    //Si existe en base de datos firmo con JWT:
    const token = jwt.sign(
        { id: doctor.id, email: doctor.email, role: doctor.role },
        env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: doctor.id, email: doctor.email, role: doctor.role },
        env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );


    logger.info(
        
        `Doctor logged successfully | Email: ${email}`
    );


    // Eliminar password_hash antes de retornar al cliente:
    delete doctor.password_hash;


    return {
        doctor,
        token,
        refreshToken
    };


};

export { tryDemoService };
export default loginUser;