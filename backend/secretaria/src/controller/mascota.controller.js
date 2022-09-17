const db = require("../db/database");
exports.getMascotas = async (req, res) => {
  try {
    let { id } = req.params;
    let sql = `CALL obtenerMascotas (${id})`;
    const result = await db.query(sql);
    console.log(result[0]);
    return res.json(result[0]);
  } catch (error) {
    console.log(error);
    return res.json({ message: "error getting Mascota", description: error });
  }
};
