const db = require("../db/database");

//getSalas --- Devuelve el id y nombre de todas las salas
exports.getSalas = async (req, res) => {
  try {
    const result = await db.query(`SELECT id_sala AS id, nombre FROM SALA`);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener Sala. ",
      descirption: error,
    });
  }
};
