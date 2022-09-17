const db = require("../db/database");


//manejoDescuento --- Premite crear descuentos.
exports.postDescuento = async (req, res) => {
  try {
    // tipoAccionIN INT Tipo de acción:1 - crear 2 - activar 3 - desactivar 4 - eliminar
    // nombreNuevoIN VARCHAR(100)
    // cantidadNuevoIN NUMERIC
    // idDescuentoIN INT  1-Activo 2-Inactivo 3-Eliminado
    const data = req.body;
    console.log(data);
    let arrayParams = [1, data.nombre, data.cantidad, 5];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos en manejo de Descuentos",
      });

    const result = await db.query("CALL manejarDescuento (?,?,?,?)", arrayParams);
    console.log(result);
    return res.status(200).json({ message: "Descuento Creado!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error al crear Descuentos. ",
      descirption: error,
    });
    
  }
};

//manejoDescuento --- Premite eliminar descuentos.
exports.eliminarDescuento = async (req, res) => {
  try {
    // tipoAccionIN INT Tipo de acción:1 - crear 2 - activar 3 - desactivar 4 - eliminar
    // nombreNuevoIN VARCHAR(100)
    // cantidadNuevoIN NUMERIC
    // idDescuentoIN INT  1-Activo 2-Inactivo 3-Eliminado
    const data = req.params;
    let arrayParams = [4, "d", 5, data.id];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos en eliminar Descuentos",
      });

    await db.query("CALL manejarDescuento (?,?,?,?);", arrayParams);
    return res.status(200).json({ message: "Se ha Eliminado el decuento!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error al eliminar Descuentos. ",
      descirption: error,
    });
  }
};


exports.updateDescuentos = async (req, res) => {
  try {
    // tipoAccionIN INT Tipo de acción:1 - crear 2 - activar 3 - desactivar 4 - eliminar
    // nombreNuevoIN VARCHAR(100)
    // cantidadNuevoIN NUMERIC
    // idDescuentoIN INT  1-Activo 2-Inactivo 3-Eliminado
    const data = req.body;
    let arrayParams = [2, data.nombre, data.cantidad, data.id];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos en actualizar Descuentos",
      });

    await db.query("CALL manejarDescuento (?,?,?,?);", arrayParams);
    return res.status(200).json({ message: "Se ha actualizado el decuento!" });
  } catch (error) {
    return res.status(400).json({
      message: "Error al actualizar Descuentos. ",
      descirption: error,
    });
  }
};

exports.getDescuentos = async (req, res) => {
  try {
    const result = await db.query("CALL obtenerDescuentos();");
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener Descuentos. ",
      descirption: error,
    });
  }
};

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