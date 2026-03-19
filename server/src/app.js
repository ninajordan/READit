import express from "express";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import usersRouter from "./features/users/users.routes.js";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./config/passport.js";
import usersRouter from "./features/users/users.routes.js";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "readit-session",
    resave: false,
    saveUninitialized: false,
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", usersRouter);

app.get("/", (req, res) => {
  res.send("READit API running");
});

app.use("/api/users", usersRouter);

export default app;
