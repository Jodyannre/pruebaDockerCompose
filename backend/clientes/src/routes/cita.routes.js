const express = require("express");
const router = express.Router();

const cita = require("../controllers/cita.controllers");

/**
 * Post Cita
 */
 router.post("/",cita.postCita);


/**
 * Post Tipo Cita
 * router.post('/postTipoCita',cita.TipoCita);
 */

/**
 * update cita, estado cita
 */
 router.put('/',cita.updateCitaEstado);

/**
 * Post motivo Cita
 */
// router.post("/postMotivo", cita.postMotivo);

router.post('/test',cita.enpoint_test);



module.exports = router;
