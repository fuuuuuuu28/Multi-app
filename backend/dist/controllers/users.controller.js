"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.clerkProvider = void 0;
const users_model_1 = require("../models/users.model");
const clerkProvider = async (req, res, next) => {
    try {
        const { clerkId, fullName, image } = req.body;
        // console.log(req.body);
        let user = await users_model_1.User.findOne({ clerkId });
        if (!user) {
            user = await users_model_1.User.create({
                clerkId,
                fullName,
                image,
            });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.log("clerkProvider controller: ", error.message);
        next(error);
    }
};
exports.clerkProvider = clerkProvider;
const getProfile = async (req, res, next) => {
    try {
        const clerkId = req.clerkId;
        const users = await users_model_1.User.find({ clerkId: { $ne: clerkId } }).populate("lastMessage");
        if (!users) {
            return res.status(400).json({ message: "Not found users getProfile" });
        }
        // console.log(users)
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        console.log("getProfile controller: ", error.message);
        next(error);
    }
};
exports.getProfile = getProfile;
