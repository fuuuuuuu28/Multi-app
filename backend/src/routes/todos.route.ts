import { Router } from "express";
import { addTodos, deleteTodo, getTodos, toggleTodo } from "../controllers/todos.controller";
import { getUser } from "../middlewares/middleware";

const router = Router();
router.post("/add",getUser ,addTodos);
router.get("/", getUser, getTodos);
router.patch("/toggle/:id",getUser, toggleTodo)
router.delete("/delete/:id",getUser, deleteTodo);

export default router;