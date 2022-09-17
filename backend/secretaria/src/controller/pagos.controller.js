const db = require("../db/database");

//getListPagos --- Premite  recuperar todos los pagos cancelados, pendientes y por pagar
exports.getListPagos = async (req, res) => {
  try {
    const data = req.params;
    let arrayParams = [data.idUsuario];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos. Se requiere idUsuario.",
      });

    let result = await db.query("CALL obtenerPagoGenerado (?);", arrayParams);
    console.log(result);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener Datos. ",
      descirption: error,
    });
  }
};

//postPago --- Premite  registrar un pago
exports.postPago = async (req, res) => {
  try {
    const data = req.body;
    let arrayParams = [data.idPago, data.tipo];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos. Se requiere idUsuario.",
      });

    let result = await db.query("CALL pagar (?,?);", arrayParams);
    console.log(result[0][0].resultado);
    if (result[0][0].resultado != 1) {
      return res.status(400).json({
        message: "Error al registrar Pago. ",
      });
    }
    return res
      .status(200)
      .json({ message: "Se ha registrado el pago con exito." });
  } catch (error) {
    return res.status(400).json({
      message: "Error al registrar Pago. ",
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
