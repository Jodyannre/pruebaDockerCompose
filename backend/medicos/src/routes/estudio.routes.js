const express = require("express");
const router = express.Router();

const estudio = require("../controllers/estudio.controllers");

//Peticiones
router.post("/", estudio.postEstudio);
router.delete("/", estudio.deleteEstudio);

module.exports = router;
