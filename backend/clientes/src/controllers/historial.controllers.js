const db = require("../db/database");

//getHistorialMedico ---se muestra todas las citas finalizadas por el cliente o por el medico
exports.getHistorialMedico = async (req, res,next) => {
  try {
    const { id, Tipo, idMascota } = req.params;
    req.body = req.params;
    console.log(idMascota);
    let arrayParams = [id, Tipo];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos. Se requiere id y Tipo",
      });

    let CitasPendientes = [];
    let respuesta = null;
    if (Tipo == "Cliente") {
      const result = await db.query(
        `CALL obtenerHistorialCitasCliente (${id},1)`
      );
      respuesta = result[0];
    } else {
      const result = await db.query(
        `CALL obtenerHistorialCitasMedico (${id},1)`
      );
      respuesta = result[0];
    }
    let lstMotivos = [];
    // Obteniendo motivos
    for (let index = 0; index < respuesta.length; index++) {
      const element = respuesta[index];
      if (idMascota !== "nulo") {
        if (element.idMascota != idMascota) {
          continue;
        }
      }
      lstMotivos.push(element);
    }
    req.data = lstMotivos;
    req.error = "No";
    next()
    return res.status(200).json(lstMotivos);
  } catch (error) {
    console.log(error);
    req.data = {
      message: "Error al obtener citas. ",
      descirption: error,
    };
    req.error = "Si";
    next()
    return res.status(400).json({
      message: "Error al obtener citas. ",
      descirption: error,
    });
  }
};

//getCitasPendientes ---se muestra las citas pendientes es decir posteriores, ya sea del cliente o del medico
exports.getCitasPendientes = async (req, res,next) => {
  try {
    const { id, Tipo } = req.params;
    let arrayParams = [id, Tipo];
    req.body = req.params;
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos. Se requiere id y Tipo",
      });

    let CitasPendientes = [];
    let respuesta = null;
    if (Tipo == "Cliente") {
      console.log("Cliente");
      const result = await db.query(
        `CALL obtenerHistorialCitasCliente (${id},2)`
      );
      respuesta = result[0];
      console.log(respuesta);
    } else {
      const result = await db.query(
        `CALL obtenerHistorialCitasMedico (${id},2)`
      );
      respuesta = result[0];
    }
    req.data = respuesta;
    req.error = "No";
    next()
    return res.status(200).json(respuesta);
  } catch (error) {
    req.data = {
      message: "Error al obtener citas. ",
      descirption: error,
    };
    req.error = "Si";
    next()
    return res.status(400).json({
      message: "Error al obtener citas. ",
      descirption: error,
    });
  }
};

exports.getRecetaporCita = async (req, res,next) => {
  try {
    const { idMotivo } = req.params;
    req.boyd = req.params;
    let receta = await db.query(`CALL obtenerRecetasPorMotivo (${idMotivo})`);
    let medicamentos = [];
    let recetaCompleta;
    if (receta[0].length > 0) {
      medicamentos = await db.query(
        `CALL obtenerMedicinaPorReceta (${receta[0][0].id_receta})`
      );
      recetaCompleta = {
        receta: receta[0][0],
        medicamentos: medicamentos[0],
      };
    } else {
      recetaCompleta = {
        receta: null,
        medicamentos: null,
      };
    }
    req.data = recetaCompleta;
    req.error = "No";
    next()
    return res.status(200).json(recetaCompleta);
  } catch (error) {
    console.log(error);
    req.data = {
      message: "Error al obtener receta. ",
      descirption: error,
    };
    req.error = "Si";
    next()
    return res.status(400).json({
      message: "Error al obtener receta. ",
      descirption: error,
    });
  }
};

exports.getEstudiosporCita = async (req, res,next) => {
  try {
    const { idMotivo } = req.params;
    req.body = req.params;
    let estudio = await db.query(`CALL obtenerEstudiosPorMotivo (${idMotivo})`);
    if (estudio[0].length > 0) {
      req.data = estudio[0][0];
      req.error = "No";
      next()
      return res.status(200).json(estudio[0][0]);
    } else {
      req.data = null;
      req.error = "No";
      next()
      return res.status(200).json(null);
    }
  } catch (error) {
    console.log(error);
    req.data = {
      message: "Error al obtener estudios. ",
      descirption: error,
    };
      req.error = "Si";
      next()
    return res.status(400).json({
      message: "Error al obtener estudios. ",
      descirption: error,
    });
  }
};

// Verifica que no existan nulos, indefinidos, 0 ó cadenas vacías
function notUndefinedNull(arrayParams) {
  for (let index = 0; index < arrayParams.length; index++) {
    let element = arrayParams[index];
    if (
      element == undefined ||
      element == null ||
      element == "" ||
      element == " "
    ) {
      return false;
    }
  }
  return true;
}
