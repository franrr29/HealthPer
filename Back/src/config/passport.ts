//Importo variables y passport para usar lo creado en google

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import { pool } from "./db";


//Usar el servicio de passport

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        const name = profile.displayName;

        // Buscar si el usuario ya existe

        const [rows]: any = await pool.execute(
          "SELECT * FROM doctors WHERE email = ?",
          [email]
        );

        if (rows.length > 0) {
          return done(null, rows[0]);
        }

        // Si no existe el usuario creo uno:

        const [result]: any = await pool.execute(
          "INSERT INTO doctors (name, email, password_hash) VALUES (?, ?, ?)",
          [name, email, "oauth_google"]
        );

        const [newUser]: any = await pool.execute(
          "SELECT * FROM doctors WHERE id = ?",
          [result.insertId]
        );

        return done(null, newUser[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;