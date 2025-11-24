import mongoose from "mongoose";

const todos = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
    clerkId:{
        type:String,
        required:true,
    }
  },
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model("Todo", todos);
