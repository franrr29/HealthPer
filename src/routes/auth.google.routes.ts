//Ruta para google passport:

import { Router, RequestHandler} from "express";;
import passport from "passport";
import { handleGoogleCallback } from "../controllers/auth.google.controller";


const router= Router();


    // Enviar usuario a login de google

router.get("/google", passport.authenticate("google",
     { scope: ["profile", "email"] }));


     // Recibir respuesta de google y generar login del usuario
router.get( "/google/callback", passport.authenticate("google",
     { session: false }), 
     handleGoogleCallback as RequestHandler);

export default router;