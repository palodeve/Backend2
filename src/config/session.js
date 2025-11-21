import session from "express-session";
import MongoStore from "connect-mongo";
import { mongo } from "mongoose";

function sessionMW( {
    store= process.env.SESSION_STORE|| 'mongo',
    mongoUrl= process.env.MONGO_URL,
    secret= process.env.SESSION_SECRET ,
    ttlSeconds=Number(process.env.SESSION_TTL) || 1800
}={})
{   let sessionStore;
    let sessionOptions;
    if (store ==='mongo') {
        sessionStore=MongoStore.create({
                mongoUrl,
                ttl: ttlSeconds,
                crypto: {secret},
            })
            console.log('Using MongoDB for session storage');
    }else {
        sessionStore = undefined
        console.warn('session store not configured, using default (memory store)');
}
return session({
    store: sessionStore,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: ttlSeconds * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure:String(process.env.COOKIE_SECURE)|| 'false)'
        },
        
    });
}
export {sessionMW}; 