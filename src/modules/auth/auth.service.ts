//Recibe parametros de auth.controllers, verifica en base de datos, registra y responde al front:

import { conexionDB } from "../../config/db";
import bcrypt from "bcrypt";
import { logger } from "../../config/logger";
import { RowDataPacket } from "mysql2/promise";


// rowdatapacket lo agregue porque lo utilizo para tipar los resultados de las
//  consultas a la base de datos


async function registerDoc(name: string, email: string, password: string) {

    try {

        //Verifico si existe el email del doc:
        const [rows] = await conexionDB.query<RowDataPacket[]>(
            "SELECT * FROM doctors WHERE email= ?",
            [email]
        );


        if (rows.length > 0) {
            throw new Error("Doctor already exists")
        }


        //hashear contraseña antes de guardar
        const saltRounds = 12

        const hashPassword = await bcrypt.hash(
            password,
            saltRounds
        );


        const [guardarDoc] = await conexionDB.query<RowDataPacket[]>(
            "INSERT INTO doctors (name, email, password_hash) VALUES (?,?,?)",
            [name, email, hashPassword]
        );


        logger.info(
            
            `Doctor registered successfully | Name: ${name} | Email: ${email}`
        );


        return guardarDoc;


    } catch (error) {

        throw (error)

    }

}

export default registerDoc;