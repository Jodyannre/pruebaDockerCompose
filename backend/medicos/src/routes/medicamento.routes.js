const express = require("express");
const router = express.Router();

const medicamento = require("../controllers/medicamento.controllers");

//Peticiones
router.get("/", medicamento.getMedicamento);

module.exports = router;
