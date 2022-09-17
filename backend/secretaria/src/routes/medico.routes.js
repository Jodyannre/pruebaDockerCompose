const express = require("express");
const router = express.Router();

const medico = require("../controller/medico.controller");

router.post("/calendario", medico.getMedicoEstado);
router.get("/salas", medico.getSalas_Medicos);

module.exports = router;
