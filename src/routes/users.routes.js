import { Router } from "express";
import UserModel from "../models/user.model.js";

const router = Router();

// GET 
router.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find().select("-password").lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET 
router.get("/:uid", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.uid).select("-password").lean();
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
