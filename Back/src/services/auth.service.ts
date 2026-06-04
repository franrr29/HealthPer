//Recibe parametros de auth.controllers, verifica en base de datos, registra y responde al front:

import { conexionDB } from "../config/db";
import bcrypt from "bcrypt";
import { logger } from "../config/logger";


async function registerDoc(name: string, email: string, password: string) {

    try {

        //Verifico si existe el email del doc:
        const [rows] = await conexionDB.query(
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


        const [guardarDoc] = await conexionDB.query(
            "INSERT INTO doctors (name, email, password VALUES) (?,?,?)",
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