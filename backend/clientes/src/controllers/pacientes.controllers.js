const db = require("../db/database");

//getlistadoUsuarioPacientes --- Devuelve los datos de todos los clientes que estén de alta
exports.getListaUsuarioPacientes = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT P.id_persona, P.nombre, P.correo ,P.edad, P.direccion, P.telefono, C.id_t_cl, U.id_e_us, U.id_t_us
      FROM PERSONA AS P 
      INNER JOIN CLIENTE AS C ON C.id_persona=P.id_persona
      INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
      WHERE U.id_e_us=2`
    );

    if (result.length == 0)
      return res.status(400).json({
        message: "No se encontró ningun cliente registrado. ",
      });

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener los datos de los clientes. ",
      descirption: error,
    });
  }
};
