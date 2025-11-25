"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const express_1 = require("@clerk/express");
const users_model_1 = require("../models/users.model");
const getUser = async (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        // console.log("pass", userId)
        if (!userId) {
            // return res.status(400).json({message:"Not found clerkId"})
            throw new Error("Cannot find clerkId");
        }
        // console.log(userId)
        const hasUser = await users_model_1.User.findOne({ clerkId: userId });
        if (!hasUser) {
            return res.status(400).json({ message: "Not found hasUser middleware" });
        }
        req.clerkId = hasUser.clerkId;
        next();
    }
    catch (error) {
        console.log("Error in getUser middleware");
        return res.status(400).json({ message: error.message });
    }
};
exports.getUser = getUser;
