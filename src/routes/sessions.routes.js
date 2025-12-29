import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserDTO from "../dto/user.dto.js";


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


// LOGOUT web
router.post('/logout-web', (_req, res) => {
  res.clearCookie(COOKIE,{
    path:'/',
    sameSite:'lax',
    secure: IS_PROD,
    httpOnly:true,
    signed:true
  });
  return res.redirect(303,'/login');
});

/* LOGIN (WEB) */
router.post('/login-web', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login?error=Credenciales%20inv%C3%A1lidas');

    const token = sign({ sub: user.id, email: user.email, role: user.role });

    res.cookie(COOKIE, token, {
      httpOnly: true,
      signed: true,
      sameSite: 'lax',   
      secure: IS_PROD,
      maxAge: 15 * 60 * 1000,
      path: '/'
    });

    return res.json({ ok: true });
  })(req, res, next);
});


// CURRENT 
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json({ status: "success", user: userDTO });
  }
);





export default router;
