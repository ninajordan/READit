import bcrypt from "bcryptjs";
import passport from "passport";
import {
  createUser,
  findUserByUsername,
  generateAnonymousTag,
} from "./user.service.js";

export function userLogin(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Login failed", error: String(err) });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Invalid credentials" });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ message: "Login failed", error: String(loginErr) });
      }

      const safeUser = { ...user };
      delete safeUser.passwordHash;

      return res.status(200).json({
        message: "User Login Successful",
        userID: safeUser.userID,
        user: safeUser,
      });
    });
  })(req, res, next);
}

export async function userRegister(req, res) {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      return res
        .status(400)
        .json({ message: "username, password, and name are required" });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user_anonymity = generateAnonymousTag();

    const newUser = await createUser({
      username,
      passwordHash,
      name,
      user_anonymity,
    });

    const safeUser = { ...newUser };
    delete safeUser.passwordHash;

    return res.status(201).json({
      message: "User Registration Successful",
      userID: safeUser.userID,
      user: safeUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in User Register", error: String(error) });
  }
}

export function userLogout(req, res) {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: String(err) });
    }
    req.session.destroy(() => {
      return res.status(200).json({ message: "Logout successful" });
    });
  });
}
