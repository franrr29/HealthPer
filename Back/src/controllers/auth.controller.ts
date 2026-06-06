import { Request, Response, NextFunction} from "express";
import registerDoc from "../services/auth.service";
import loginUser from "../services/auth.login.service";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
//Funcion para capturar datos del front y dirigir a auth.service:

async function registerUser (req: Request, res: Response, next: NextFunction){

    try {

        const { name, email, password }= req.body;
        
        //Enviar logica a service para registrar doctor nuevo o rechazar si existe
        const verificarRegistro= await registerDoc(name, email, password);
       
        res.status(201).json({
            success: true,
            message: "Doctor registered successfully",
            data: verificarRegistro})



    } catch (error){

        next (error)
    
    }
};


//Funcion para logear usuario ya registrado:

async function logginUser(req: Request, res: Response, next: NextFunction) {
    
    try {

        const { email, password }= req.body;

        //Verificar si el email existe en base de datos:

        const loggedUser= await loginUser (email, password);

        res.status(200).json({
            success: true,
            message: "Welcome back doctor",
            data: loggedUser});


    } catch (error){

        next (error)
    }
}


//Borrar token y dar logout cerra sesion que viene del front:

export function logout (req: Request, res: Response){

    res.status(200).json({
        message: "Logged out successfull"
    });
};



// Generar nuevo access token usando refresh token

export function refreshToken(req: Request, res: Response) {
    
    // Obtener refresh token enviado por el frontend

    const { refreshToken } = req.body;


    // Verificar si existe el token

    if (!refreshToken) {

        res.status(401).json({
            message: "Refresh token required"
        });

        return;
    }


    try {

        // Verificar si el refresh token es valido

        const payload = jwt.verify(
            refreshToken,
            env.JWT_SECRET
        );


        // Crear nuevo access token

        const newAccessToken = jwt.sign(
            payload,
            env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );


        // Enviar nuevo token

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken
        });


    } catch {

        // Token invlido o vencido
        
        res.status(401).json({
            message: "Invalid or expired refresh token"
        });

    }
}


export { registerUser, logginUser };