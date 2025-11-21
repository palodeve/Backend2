import { Router } from "express";
import passport from "passport";

const router = Router();

router.post("/register",
    passport.authenticate("register", { failureRedirect: "/register" }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect("/products");
    }
);

router.post("/login",
    passport.authenticate("login", { failureRedirect: "/login" }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect("/products");
    }
);

// ----------------------
// GITHUB LOGIN
// ----------------------
router.get("/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect("/products");
    }
);

// LOGOUT
router.get("/logout", (req, res) => {
    req.logout(() => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });
});

export default router;
