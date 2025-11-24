import  mongoose  from 'mongoose';

const gemini = new mongoose.Schema(
    {
        clerkId:{
            type:String,
            required:true,
        },
        text:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:["model", "user"],
            required:true,
        },
    },
    {
        timestamps:true
    }
)

export const Gemini = mongoose.model("Gemini", gemini);