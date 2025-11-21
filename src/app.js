import { engine } from 'express-handlebars';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import userRouter from './routes/users.routes.js';
// import errorMW from './middlewares/error.middleware.js';
// import sessionMW from './middlewares/session.middleware.js';
// import {auth} from './middlewares/auth.js';
// import sessionRoutes from './routes/sessions.routes.js';

// import initializePassport from './config/passport.config.js';
// import passport from 'passport';
// import { passportCall } from './utils/passport.utils.js';
// import { authorization } from './middlewares/authorization.middleware.js';

import jwt from 'jsonwebtoken';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG VIEWS
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
//app.use(sessionMW);

// RUTAS
//app.get('/health', (_req, res) => { res.json({ ok: true }); });
app.get('/login', (req, res) => {
    if (req.signedCookies.currentUser) return res.redirect('/current');
    res.render('login');
});
//app.get('/register', (req, res) => res.render('register'));
// app.get('/products', (req, res) => {
//     if (!req.session.user) return res.redirect('/login');
//     res.render('products', { user: req.session.user });
// });
app.get('/current', (req, res) => {
    const token = req.signedCookies.currentUser;
    if (!token) return res.redirect('/login');

    const user = jwt.verify(token, process.env.JWT_SECRET); // decodificar
    res.render('current', { user });
});

app.use('/api/users', userRouter);
//app.use('/api/sessions', sessionRoutes);

// Inicializar passport
// initializePassport();
// app.use(passport.initialize());
// app.use(passport.session());

//jwt
// app.post('/login',(req,res)=>{
//     const {username,password}=req.body;
//     // Aquí deberías validar el usuario y la contraseña
//     if(username==='usuario' && password==='contraseña'){
//         // Si es válido, crear un token JWT
//         const token=jwt.sign({username},'tu_clave_secreta',{expiresIn:'1h'});
//         res.send({messsage:'inicio de sesión exitoso',token});

//     }})
// app.get('/current',passportCall('jwt'),authorization('user'), (req,res)=>{
//     res.send(req.user);
// });   

// Middleware para proteger rutas
// const authJWT = (req, res, next) => {
//     const token = req.signedCookies.currentUser;
//     if (!token) return res.redirect('/login');

//     try {
//         const user = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = user;
//         next();
//     } catch (err) {
//         return res.redirect('/login');
//     }
// };

// Vista protegida
// app.get('/current', authJWT, (req, res) => {
//     res.render('current', { user: req.user });
// });

// 404
app.use((_req,res)=> res.status(404).json({ message:'ruta no encontrada' }));

// Errores
//app.use(errorMW);

export default app;
