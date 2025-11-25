"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middlewares/middleware");
const messages_controller_1 = require("../controllers/messages.controller");
const router = (0, express_1.Router)();
router.get("/:userId", middleware_1.getUser, messages_controller_1.getMessages);
exports.default = router;
