const db = require("../db/database");

//postEstudio --- Premite crear un estudio
exports.postEstudio = async (req, res) => {
  try {
    console.log("dasd", req.body);
    const data = req.body;
    let arrayParams = [data.direccion, data.nombre, data.idMotivo];
    if (!notUndefinedNull(arrayParams)){
      console.log("error");
      return res.status(400).json({
        message: "Error, datos incompletos",
      });
    }

    await db.query("CALL crearEstudio (?,?,?);", arrayParams);
    return res.status(200).json({ message: "Estudio Registrado!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error al crear Estudio. ",
      descirption: error,
    });
  }
};

//deleteestudio --- Premite eliminar un estudio
exports.deleteEstudio = async (req, res) => {
  try {
    const { id_estudio } = req.body;
    let arrayParams = [id_estudio];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message:
          "Error, datos incompletos. Se requiere id del estudio a eliminar",
      });

    const result = await db.query(
      `DELETE FROM ESTUDIO WHERE id_estudio=${id_estudio}`
    );
    if (result.affectedRows == 0)
      return res
        .status(200)
        .json({ message: "No se encontró ningún estudio con este id" });
    return res.status(200).json({ message: "Estudio Eliminado!" });
  } catch (error) {
    return res.status(400).json({
      message: "Error al eliminar Estudio. ",
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
