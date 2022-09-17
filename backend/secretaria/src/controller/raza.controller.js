const { json } = require("body-parser");
const db = require("../db/database");

exports.postRaza = async (req, res) => {
  try {
    let { raza } = req.body;
    //console.log(raza);
    let sql = `CALL crearRaza ("${raza}")`;
    const result = await db.query(sql);
    if (result[0][0].resultado == 1) {
      return res.json({ msg: "raza creada" });
    } else {
      return res.json({ msg: "Raza ya existe" });
    }
  } catch (err) {
    console.log(err);
    return res.json({ msg: "error posting raza" });
  }
};

exports.getRaza = async (req, res) => {
  try {
    let sql = `CALL obtenerRazas ();`;
    const result = await db.query(sql);
    return res.json(result[0]);
  } catch (error) {
    console.log(error);
    return res.json({ msg: "error getting Raza" });
  }
};

exports.postMascota = async (req, res) => {
  try {
    let { usuario_id, nombre, edad, foto, genero, raza } = req.body;

    let sql = `CALL crearMascota (${usuario_id},"${nombre}",${edad},"${foto}",${genero},${raza})`;

    const result = await db.query(sql);
    console.log(result);
    const mascota = {
      id: result.id,
      direccion: result.direccion,
      nombre: result.nombre,
    };

    return res.json(mascota);
  } catch (error) {
    console.log(error);
    return res.json({ msg: "error posting Mascota" });
  }
};
