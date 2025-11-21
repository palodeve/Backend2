// src/routes/users.routes.js
import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET user by id
router.get("/:uid", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.uid).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE user
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
