const db = require("../db/database");

//getCita --- Devuelve la cita actual es decir la cita que esta programada para la hora actual
exports.getCita = async (req, res) => {
  try {
    const { idMedico } = req.params;
    let arrayParams = [idMedico];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos. Se requiere idMedico",
      });

    const result = await db.query(`CALL obtenerCitaActualMedico (${idMedico})`);

    return res.status(200).json(result[0][0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener cita. ",
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
