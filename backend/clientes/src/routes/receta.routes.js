const express = require("express");
const router = express.Router();

const receta = require("../controllers/receta.controllers");

//Peticiones
router.get("/", receta.getReceta);

/**
 * Receta y Medicamento
 */

router.post("/", receta.receta_create);

module.exports = router;
