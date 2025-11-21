import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number,
    role: { type: String, default: "user" },
    cart: String
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
