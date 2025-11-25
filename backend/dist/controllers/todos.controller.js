"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.toggleTodo = exports.getTodos = exports.addTodos = void 0;
const todos_model_1 = require("../models/todos.model");
const addTodos = async (req, res, next) => {
    try {
        const clerkId = req.clerkId;
        const { task, completed } = req.body;
        if (!task || !clerkId) {
            return res.status(400).json({ message: "Not found" });
        }
        const newTask = await todos_model_1.Todo.create({
            task,
            completed,
            clerkId,
        });
        res.status(200).json({ newTask });
    }
    catch (error) {
        console.log("addTodos controller error", error.message);
        next(error);
    }
};
exports.addTodos = addTodos;
const getTodos = async (req, res, next) => {
    try {
        const clerkId = req.clerkId;
        if (!clerkId) {
            return res.status(400).json({ message: "Not found user" });
        }
        const tasks = await todos_model_1.Todo.find({ clerkId });
        res.status(200).json({ tasks });
    }
    catch (error) {
        console.log("getTodos controller error", error.message);
        next(error);
    }
};
exports.getTodos = getTodos;
const toggleTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clerkId = req.clerkId;
        const task = await todos_model_1.Todo.findOne({ _id: id, clerkId });
        if (!task) {
            return res.status(400).json({ message: "Not found task" });
        }
        task.completed = !task.completed;
        await task.save();
        res.status(200).json({ task });
    }
    catch (error) {
        console.log("toggleTodo controller error", error.message);
        next(error);
    }
};
exports.toggleTodo = toggleTodo;
const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clerkId = req.clerkId;
        const task = await todos_model_1.Todo.findOneAndDelete({ _id: id, clerkId });
        if (!task) {
            return res.status(400).json({ message: "Not found task" });
        }
        res.status(200).json({ task });
    }
    catch (error) {
        console.log("deleteTodo controller error", error.message);
        next(error);
    }
};
exports.deleteTodo = deleteTodo;
