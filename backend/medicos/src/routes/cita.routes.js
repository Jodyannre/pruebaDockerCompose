const express = require("express");
const router = express.Router();

const cita = require("../controllers/cita.controllers");

//Peticiones
router.get("/:idMedico", cita.getCita);

module.exports = router;
