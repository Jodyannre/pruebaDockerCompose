const express = require("express");
const router = express.Router();

const pagos = require("../controller/pagos.controller");

router.get("/:idUsuario", pagos.getListPagos);
router.post("/", pagos.postPago);

module.exports = router;
