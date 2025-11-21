
import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../config/util.config.js";
import dotenv from "dotenv";

dotenv.config();

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// extractor que busca token en cookie firmada 'currentUser'
const cookieExtractor = (req) => {
  let token = null;
  try {
    if (req && req.signedCookies && req.signedCookies.currentUser) {
      token = req.signedCookies.currentUser;
    } else if (req && req.cookies && req.cookies.currentUser) {
      token = req.cookies.currentUser;
    }
  } catch (err) {
    token = null;
  }
  return token;
};

const initializePassport = () => {
  // REGISTER
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const existing = await userModel.findOne({ email });
          if (existing) return done(null, false, { message: "User already exists" });

          const hashed = createHash(password);

          const newUser = await userModel.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email,
            password: hashed,
            age: req.body.age,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // LOGIN
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) return done(null, false, { message: "User not found" });

          const valid = isValidPassword(password, user.password);
          if (!valid) return done(null, false, { message: "Invalid credentials" });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // JWT strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          cookieExtractor,
          ExtractJWT.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          // guardamos id al firmar token
          const user = await userModel.findById(jwt_payload.id).select("-password");
          if (!user) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default initializePassport;
