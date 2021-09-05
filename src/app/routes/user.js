"use strict"
const router = require("express").Router();
const userController = require("../controllers/user");
// const auth = require("../middleware/auth");

// Login 
router.post("/login", userController.login);

// Register 
router.post("/signup",userController.signup); 

// Confirmation 
router.get("/confirmation/:token",userController.confirmation); 

// Resend Confirmation Email
router.post("/resend/confirmation/email",userController.reSendConfirmationEmail); 
module.exports = router;