import { Request, Response, NextFunction} from "express";
import registerDoc from "../services/auth.service";
import loginUser from "../services/auth.login.service";


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

export  {registerUser, logginUser}; 