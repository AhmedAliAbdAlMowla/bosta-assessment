"use strict"
const router = require("express").Router();
const checkController = require("../controllers/check");
const auth = require("../middlewares/auth");

router.get("/", [auth], checkController.getAll); 
router.get("/:checkId", [auth], checkController.getOne); 
router.post("/", [auth], checkController.create);
router.patch("/:checkId", [auth], checkController.update);

module.exports = router;