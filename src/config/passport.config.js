import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../models/user.model.js";
import { createHash, isValidPassword } from "./util.config.js";
import jwt from "passport-jwt";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

 const cookiesExtractor = req => {
        let token = null;
        console.log(req.headers)    
        if (req && req.cookies) {
            token = req.cookies.authorization.split(" ")[1];
        }
        return token;
    };
        
 // REGISTER STRATEGY
const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookiesExtractor]),
        secretOrKey: 'secretKey'
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // ---------------------------
    // LOGIN STRATEGY
    // ---------------------------
    // passport.use("login", new LocalStrategy(
    //     {
    //         usernameField: "email"
    //     },
    //     async (email, password, done) => {
    //         try {
    //             const user = await UserModel.findOne({ email });
    //             if (!user) return done(null, false);

    //             const valid = isValidPassword(user, password);
    //             if (!valid) return done(null, false);

    //             return done(null, user);
    //         } catch (err) {
    //             return done(err);
    //         }
    //     }
    // ));

    // ---------------------------
    // GITHUB STRATEGY
    // ---------------------------
    // passport.use("github", new GitHubStrategy(
    //     {
    //         clientID: process.env.GITHUB_CLIENT_ID,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //         callbackURL: "http://localhost:3000/api/sessions/github/callback"
    //     },
    //     async (accessToken, refreshToken, profile, done) => {
    //         try {
    //             const email = profile.emails?.[0]?.value;

    //             let user = await UserModel.findOne({ email });

    //             if (!user) {
    //                 user = await UserModel.create({
    //                     first_name: profile.displayName || "GitHub",
    //                     last_name: "User",
    //                     email,
    //                     password: createHash("github_temp_pass"),
    //                     age: 18
    //                 });
    //             }

    //             return done(null, user);

    //         } catch (err) {
    //             return done(err);
    //         }
    //     }
    // ));

    // ---------------------------
    // SERIALIZACIÓN
    // ---------------------------
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;
