const express = require("express");
const controller = require("../controllers/users-controllers");

const userRouter = express.Router();

userRouter.post("/register", controller.userRegister);
userRouter.post("/login", controller.userLogin);

module.exports = userRouter;
