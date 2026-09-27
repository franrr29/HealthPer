//Ruta para google passport:

import { Router, RequestHandler} from "express";;
import passport from "passport";
import { handleGoogleCallback, initiateGoogleAuth, validateOAuthState } from "./auth.google.controller";


const router= Router();


    // Enviar usuario a login de google

router.get("/google", initiateGoogleAuth as RequestHandler);


     // Recibir respuesta de google y generar login del usuario
router.get( "/google/callback",
     validateOAuthState as RequestHandler,
     passport.authenticate("google",
     { session: false }),
     handleGoogleCallback as RequestHandler);

export default router;