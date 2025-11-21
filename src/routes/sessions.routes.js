// src/routes/sessions.routes.js
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// REGISTER -> usa passport 'register'
router.post(
  "/register",
  passport.authenticate("register", { session: false, failureRedirect: "/register?error=1" }),
  (req, res) => {
    // req.user creado por passport
    const user = req.user;
    // no devolver password
    const safeUser = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
    };
    res.status(201).json({ status: "success", user: safeUser });
  }
);

// LOGIN -> passport 'login' + genera JWT
router.post(
  "/login",
  passport.authenticate("login", { session: false, failureRedirect: "/login?error=1" }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // guardamos token en cookie firmada
    res.cookie("currentUser", token, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 60 * 1000, // 1h
      sameSite: "lax"
    });

    // también devolvemos token en body
    res.json({ status: "success", token });
  }
);

// CURRENT -> protege con passport 'jwt'
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // req.user viene de la estrategia jwt y NO incluye password
    res.json({ status: "success", user: req.user });
  }
);

export default router;
