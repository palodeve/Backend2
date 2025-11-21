import { engine } from 'express-handlebars';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

// routers
import userRouter from './routes/users.routes.js';
import sessionRouter from './routes/sessions.routes.js';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// VIEWS
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

// passport
initializePassport();
app.use(passport.initialize());

// RUTAS 
app.get('/login', (req, res) => {
  if (req.signedCookies.currentUser) return res.redirect('/current');
  res.render('login');
});

app.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('current', { user: req.user });
});

// API 
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);

// 404
app.use((_req, res) => res.status(404).json({ message: 'ruta no encontrada' }));

export default app;
