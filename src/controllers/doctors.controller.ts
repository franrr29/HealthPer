// Endpoint para traer datos del doctor logeado y mostrar en dashboard:

import {Request,Response, NextFunction } from "express";
import { getDoctorByIdService, getDoctorStatsByIdService } from "../services/doctor.service";


export async function getDoctorData(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {

        //El id del doctor logeado viene en el payload del token:
        const doctorId= req.user?.id;
        
        const searchedDoctor= await getDoctorByIdService(doctorId);

        res.status(200).json({

            success: true,

            message: "Doctor data retrieved successfully",

            data: searchedDoctor
        });


    } catch (error) {
        next(error);
    }
}



//funcion para traer las estadisticas del doctor logeado y mostrar en dashboard:
export async function getDoctorStatsById (req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const doctorId= req.user?.id;
        const doctorStats= await getDoctorStatsByIdService(doctorId);


        res.status(200).json({

            success: true,

            message: "Doctor stats retrieved successfully",

            data: doctorStats
        });


    } catch (error) {

        next(error);
    }
}