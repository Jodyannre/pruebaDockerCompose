const express = require("express");
const router = express.Router();

const descuento = require("../controllers/descuento.controllers");

//Peticiones
router.post("/", descuento.postDescuento);
router.delete("/:id", descuento.eliminarDescuento);
router.get("/", descuento.getDescuentos);


module.exports = router;
