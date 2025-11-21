import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const router = Router();

// --------------------------
// LOGIN (JWT + cookie firmada)
// --------------------------
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;

    const user = await UserModel.findOne({email});
    if(!user) return res.redirect('/login?error=1');

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.redirect('/login?error=1');

    const token = jwt.sign(
        {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    res.cookie('currentUser', token, {
        httpOnly: true,
        signed: true
    });

    return res.redirect('/current');
});

// --------------------------
// CRUD USERS
// --------------------------

// GET todos
router.get("/", async (req, res, next) => {
    try {
        const users = await UserModel.find().lean();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// GET por ID
router.get("/:uid", async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.uid).lean();
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// DELETE
router.delete("/:uid", async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.uid).lean();
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;
