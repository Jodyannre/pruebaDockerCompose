const express = require("express");
const router = express.Router();

const pacientes = require("../controllers/pacientes.controllers");
const uploadImage = require("../services/uploadImage");

//Peticiones
//router.get("/pacientes", pacientes.getListaUsuarioPacientes);

router.post("/uploadImage/:id/:carpeta", uploadImage.uploadImage);

module.exports = router;
