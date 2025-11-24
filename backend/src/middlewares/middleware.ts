import { getAuth } from "@clerk/express";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/users.model";

export const getUser = async(req:Request, res:Response, next:NextFunction) =>{
    try {
        const { userId } = getAuth(req);
        // console.log("pass", userId)
        if(!userId){
            // return res.status(400).json({message:"Not found clerkId"})
            throw new Error("Cannot find clerkId");
        }
        // console.log(userId)
        const hasUser = await User.findOne({clerkId: userId})
        if(!hasUser){
            return res.status(400).json({message:"Not found hasUser middleware"})
        }
        req.clerkId = hasUser.clerkId;
        next();
    } catch (error:any) {
        console.log("Error in getUser middleware");
        return res.status(400).json({message:error.message})
    }
}