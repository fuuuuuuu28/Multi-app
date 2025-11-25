"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const middleware_1 = require("../middlewares/middleware");
const router = (0, express_1.Router)();
router.post("/clerkProvider", users_controller_1.clerkProvider);
router.get("/", middleware_1.getUser, users_controller_1.getProfile);
exports.default = router;
