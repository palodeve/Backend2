import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// REGISTER 
router.post(
  "/register",
  passport.authenticate("register", { session: false, failureRedirect: "/register?error=1" }),
  (req, res) => {
    const user = req.user;
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

// LOGIN 
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
    res.cookie("currentUser", token, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 60 * 1000, 
      sameSite: "lax"
    });
    res.json({ status: "success", token });
  }
);
// CURRENT 
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ status: "success", user: req.user });
  }
);

export default router;
