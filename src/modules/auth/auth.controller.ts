import { Request, Response, NextFunction } from "express";
import registerDoc from "./auth.service";
import loginUser from "./auth.login.service";
import { tryDemoService } from "./auth.login.service";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { loginSchema, registerSchema, refreshTokenSchema } from "../../schemas/schema.auth";
import { accessTokenCookieOptions, refreshTokenCookieOptions, clearCookieOptions } from "../../config/cookieOptions";



interface tokenPayload {
    id: number;
    email: string;
}


//Funcion para usar el TryDemo del front y logear usuario demo:

async function tryDemo(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {
        
        if (env.ALLOW_DEMO === false) {

            res.status(403).json({ message: "Demo mode is currently disabled" });

            return;
        }

        const demoUser= await tryDemoService();

        res.cookie("accessToken", demoUser.token, accessTokenCookieOptions);

        res.cookie("refreshToken", demoUser.refreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            success: true,
            message: "Welcome to the demo doctor",
            data: demoUser.doctor
        }); 


    } catch (error) {

        next (error)
    }
}


//Funcion para capturar datos del front y dirigir a auth.service:

async function registerUser (req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        if (env.ALLOW_REGISTER === false) {

            res.status(403).json({ message: "Registration is currently disabled" });

            return;
        }

        const parsedData = registerSchema.parse(req.body);

        //Enviar logica a service para registrar doctor nuevo o rechazar si existe
        const verificarRegistro= await registerDoc(parsedData.name, parsedData.email, parsedData.password);
       
        res.status(201).json({

            success: true,

            message: "Doctor registered successfully",

            data: verificarRegistro})



    } catch (error){

        next (error)
    
    }
};



//Funcion para logear usuario ya registrado:

async function logginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {

        const parsedData = loginSchema.parse(req.body);


        //Verificar si el email existe en base de datos y envio de token de acceso y refresh token al front:

        const loggedUser= await loginUser (parsedData.email, parsedData.password);

        res.cookie("accessToken", loggedUser.token, accessTokenCookieOptions);
        res.cookie("refreshToken", loggedUser.refreshToken, refreshTokenCookieOptions);

        res.status(200).json({
            success: true,
            message: "Welcome back doctor",
            data: loggedUser.doctor
        });


    } catch (error){

        next (error)
    }
}


//Borrar token y dar logout cerra sesion que viene del front:

export function logout (req: Request, res: Response): void {

    res.clearCookie("accessToken", clearCookieOptions);

    res.clearCookie("refreshToken", clearCookieOptions);

    res.status(200).json({
        message: "Logout successful"
    });
};



// Generar nuevo access token usando refresh token

export function refreshToken(req: Request, res: Response): void {

    // obtener refresh token de la cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(401).json({
            message: "Refresh token not provided"
        });
        return;
    }

    try {

        // verificar si el refresh token es valido
        const payload = jwt.verify(
            refreshToken,
            env.REFRESH_TOKEN_SECRET
        );

        // crear nuevo access token
        const newAccessToken = jwt.sign(
            { id: (payload as tokenPayload).id, email: (payload as tokenPayload).email },
            env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // setear nuevo access token en cookie
        res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

        res.status(200).json({
            message: "Token refreshed successfully"
        });

    } catch {

        res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}


export { tryDemo, registerUser, logginUser };