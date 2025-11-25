import { NextFunction, Request, Response } from "express";
import { Todo } from "../models/todos.model";

export const addTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkId = req.clerkId;
    const { task, completed } = req.body;
    if (!task || !clerkId) {
      return res.status(400).json({ message: "Not found" });
    }

    const newTask = await Todo.create({
      task,
      completed,
      clerkId,
    });

    res.status(200).json({ newTask });
  } catch (error: any) {
    console.log("addTodos controller error", error.message);
    next(error);
  }
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkId = req.clerkId;
    if (!clerkId) {
      return res.status(400).json({ message: "Not found user" });
    }

    const tasks = await Todo.find({ clerkId });
    res.status(200).json({ tasks });
  } catch (error: any) {
    console.log("getTodos controller error", error.message);
    next(error);
  }
};

export const toggleTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("first", {id})
    const clerkId = req.clerkId;

    const task = await Todo.findOne({ _id: id, clerkId });
    if (!task) {
      return res.status(400).json({ message: "Not found task" });
    }
    task.completed = !task.completed;
    await task.save();

    res.status(200).json({ task });
  } catch (error: any) {
    console.log("toggleTodo controller error", error.message);
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const clerkId = req.clerkId;

    const task = await Todo.findOneAndDelete({ _id: id, clerkId });
    if (!task) {
      return res.status(400).json({ message: "Not found task" });
    }

    res.status(200).json({ task });
  } catch (error: any) {
    console.log("deleteTodo controller error", error.message);
    next(error);
  }
};
