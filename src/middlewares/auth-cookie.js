
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { normalize } from 'path';

export function authCookie(req, res, next) {

    const COOKIE_NAME=config.cookierName;
    const JWT_SECRET=config.jwtSecret;

    req.user=null;
    res.locals.user=null;

    try{
        const token = 
        req.signedCookies?.[COOKIE_NAME]|| 
        req.cookies?.[COOKIE_NAME]|| 
        null;

        if (!token) return next();
        
        const payload=jwt.verify(token, JWT_SECRET);
        req.user={
            id: payload.id ?? payload.sub ?? null, 
            email: payload.email, 
            role: normalizeRole
        };
            req.user=user;
            res.locals.user=user;
            return next();
    } catch(err){
        return next();
    }

}