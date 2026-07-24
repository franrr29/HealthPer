// Endpoint para traer datos del doctor logeado y mostrar en dashboard:

import {Request,Response, NextFunction } from "express";
import { getDoctorByIdService, getDoctorStatsByIdService, getRecentActivityService, getTopConditionsService } from "./doctor.service";


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


//funcion para traer las ultimas 3 consultas del doctor logeado y mostrar en dashboard:
export async function getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const doctorId= req.user?.id;
        const recentActivity= await getRecentActivityService(doctorId); 

        if (recentActivity.length === 0) {
            
            res.status(200).json({
                success: true,
                message: "No recent activity found",
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Recent activity retrieved successfully",
            data: recentActivity
        });
    } catch (error) {
        
        next(error);
    }
}



//condiciones mas frecuentes de los pacientes del doctor logeado, para mostrar en dashboard:
export async function getTopConditions(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

        const doctorId= req.user?.id;
        const topConditions= await getTopConditionsService(doctorId);

        if (topConditions.topChronicDiseases.length === 0 && topConditions.topAllergies.length === 0) {

             res.status(200).json({

                success: true,

                message: "No top conditions found",

                data: { topChronicDiseases: [], topAllergies: [] }
            });
            return;
        }

        res.status(200).json({

            success: true,

            message: "Top conditions retrieved successfully",

            data: topConditions
        });

    } catch (error) {

        next(error);
    }
}