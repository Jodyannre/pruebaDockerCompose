const express = require("express");
const router = express.Router();

const person = require("../controllers/person.controllers");

//Peticiones
router.post("/getPerson", person.getPersona);
router.get("/pacientes", person.getListaUsuarioPacientes);

module.exports = router;
