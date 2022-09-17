const express = require("express");
const router = express.Router();

const historial = require("../controllers/historial.controllers");

//Peticiones
router.get("/history/:id/:Tipo/:idMascota", historial.getHistorialMedico);
router.get("/:id/:Tipo", historial.getCitasPendientes);

router.get("/m/estudio/:idMotivo", historial.getEstudiosporCita);
router.get("/m/receta/:idMotivo", historial.getRecetaporCita);

module.exports = router;
