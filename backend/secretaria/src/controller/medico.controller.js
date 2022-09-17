const db = require("../db/database");

//getMedicoEstado --- Premite  recuperar las fechas y horas en donde estará ocupado un médico en específico
exports.getMedicoEstado = async (req, res) => {
  try {
    const data = req.body;
    let arrayParams = [data.id_medico];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message:
          "Error, datos incompletos. Se requiere id del médico del que se requiere información",
      });

    let result = await db.query(
      "CALL obtenerCalendarioOcupadoDoctor (?);",
      arrayParams
    );
    console.log(result);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener Datos. ",
      descirption: error,
    });
  }
};

//getMedicoEstado --- Premite  recuperar las fechas y horas en donde estará ocupado un médico en específico
exports.getSalas_Medicos = async (req, res) => {
  try {
    let result = await db.query("CALL obtenerCalendarioOcupadoGeneral();");
    console.log(result);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener datos. ",
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
