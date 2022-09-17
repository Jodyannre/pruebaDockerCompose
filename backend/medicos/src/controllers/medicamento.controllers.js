const db = require("../db/database");

//getMedicamento --- Devuelve el id y nombre de todos los medicamentos
exports.getMedicamento = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id_medicamento AS id, nombre FROM MEDICAMENTO`
    );
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener Medicamentos. ",
      descirption: error,
    });
  }
};
