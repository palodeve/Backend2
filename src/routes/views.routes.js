import { Router } from "express";

const router = Router();

//guar de invitado

function guestGuard(req, res, next) {
    if (req.user) return res.redirect("/profile");
    return next();

}
//guar de autenticado
function ensureAuthedView(req, res, next) {
    if (!req.user) return res.redirect("/login?error=Login%20requerido");
    return next();
}

//no cache

function noCacheLogin(req, res, next) {
    res.set("Cache-Control", "no-store", "no-cache", "must-revalidate", "private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return next();
}

export default router;