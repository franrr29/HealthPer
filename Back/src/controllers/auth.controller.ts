import { Request, Response, NextFunction} from "express";



//Funcion para capturar datos del front y dirigir a auth.service:

async function registerUser (req: Request, res: Response, next: NextFunction){

    try {

        const { name, email, password }= req.body;

        res.status(201).json({
            success: true,
            message: "Doctor registered successfully"})


    } catch (error){

        next (error)
    
    }
}

export default registerUser; 