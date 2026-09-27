import crypto from "crypto";
import bcrypt from "bcrypt";
import { ForbiddenError, UnauthorizedError, ValidationError } from "../errors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";
import * as authRepository from "../modules/auth/auth.repository";
import * as doctorRepository from "../modules/doctor/doctor.repository";

const SALT_ROUNDS = 12;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const primaryEmail = profile.emails?.[0];
        const email = primaryEmail?.value;
        const name = profile.displayName;

        if (!email) {
          return done(new ValidationError("Google account does not have an email associated"));
        }

        if (!primaryEmail?.verified) {
          return done(new UnauthorizedError("Google email is not verified"));
        }

        const existingDoctor = await authRepository.getByEmail(email);

        if (existingDoctor) {
          return done(null, {
            id: existingDoctor.id,
            email: existingDoctor.email,
            role: existingDoctor.role,
          });
        }

        if (!env.ALLOW_REGISTER) {
          return done(new ForbiddenError("Registration is currently disabled"));
        }

        const randomPassword = crypto.randomBytes(32).toString("hex");
        const passwordHash = await bcrypt.hash(randomPassword, SALT_ROUNDS);

        const newDoctorId = await authRepository.create({
          name,
          email,
          password_hash: passwordHash,
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
