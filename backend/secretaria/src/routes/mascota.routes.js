const express = require("express");
const router = express.Router();

const raza = require("../controller/mascota.controller");

router.get("/:id", raza.getMascotas);

module.exports = router;
