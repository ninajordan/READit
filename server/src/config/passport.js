import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getDatabase } from "./db.js";

export function configurePassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const db = getDatabase();
        const user = await db.collection("users").findOne({ username });
        if (!user) {
          return done(null, false, { message: "Username not found" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash || "");
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.userID);
  });

  passport.deserializeUser(async (userID, done) => {
    try {
      const db = getDatabase();
      const user = await db.collection("users").findOne({ userID });
      if (user) {
        delete user.passwordHash;
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  return passport;
}
