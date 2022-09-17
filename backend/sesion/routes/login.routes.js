const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const login = require("../controller/login.controller");

//the routes here
router.get("/getUsers", login.getUsers);
router.post("/", login.createUser);
router.post("/login", login.logIn);

//router.post('/authTest',verifyToken,login.middlewareTes);
router.post("/authTest", login.middlewareTes);

module.exports = router;
