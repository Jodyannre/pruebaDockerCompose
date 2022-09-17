const express = require("express");
const router = express.Router();

const raza = require("../controller/raza.controller");

router.post("/postRaza", raza.postRaza);

router.get("/getRazas", raza.getRaza);

router.post("/postMascota", raza.postMascota);

module.exports = router;
