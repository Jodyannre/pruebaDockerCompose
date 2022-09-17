const express = require("express");
const router = express.Router();

const user = require("../controllers/user.controllers");

//Peticiones
router.get("/:rol", user.getListaUsuarios);
router.get("/Persona", user.getListaPersonas);
router.put("/", user.updateEstadoUsuarios);

module.exports = router;
