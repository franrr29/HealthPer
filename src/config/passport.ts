import { ForbiddenError, ValidationError } from "../errors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import * as authRepository from "../modules/auth/auth.repository";
import * as doctorRepository from "../modules/doctor/doctor.repository";

const OAUTH_PASSWORD_HASH = "oauth_google";

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

        if (!email) {
          return done(new ValidationError("Google account does not have an email associated"));
        }

        if (!env.ALLOW_REGISTER) {
          return done(new ForbiddenError("Registration is currently disabled"));
        }

        const existingDoctor = await authRepository.getByEmail(email);

        if (existingDoctor) {
          return done(null, {
            id: existingDoctor.id,
            email: existingDoctor.email,
            role: existingDoctor.role,
          });
        }

        const newDoctorId = await authRepository.create({
          name,
          email,
          password_hash: OAUTH_PASSWORD_HASH,
        });

        const newDoctor = await doctorRepository.getById(newDoctorId);

        return done(null, newDoctor ?? false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
