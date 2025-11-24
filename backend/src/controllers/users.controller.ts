import { NextFunction, Request, Response } from "express";
import { User } from "../models/users.model";

export const clerkProvider = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { clerkId, fullName, image } = req.body;
    // console.log(req.body);
    let user = await User.findOne({clerkId});
    if (!user) {
      user = await User.create({
        clerkId,
        fullName,
        image,
      });
    }

    res.status(200).json({ success:true, user});
  } catch (error:any) {
    console.log("clerkProvider controller: ", error.message)
    next(error);
  }
};

export const getProfile = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const clerkId = req.clerkId;

    const users = await User.find({ clerkId: {$ne: clerkId}}).populate("lastMessage")
    if(!users){
      return res.status(400).json({message:"Not found users getProfile"})
    }
    // console.log(users)
    res.status(200).json({success:true, users})
  } catch (error:any) {
    console.log("getProfile controller: ", error.message)
    next(error);
  }
}