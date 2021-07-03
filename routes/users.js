const express = require("express");
const controller = require("../controllers/users-controllers");
const protect = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", controller.userRegister);
userRouter.post("/login", controller.userLogin);
userRouter.get("/user", protect, controller.getUserById);

module.exports = userRouter;
