const express = require("express");
const router = express.Router();

const sala = require("../controller/sala.controller");

//Peticiones
router.get("/", sala.getSalas);

module.exports = router;
