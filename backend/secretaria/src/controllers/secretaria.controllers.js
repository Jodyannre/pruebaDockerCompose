const db = require("../db/database");

//getlistadoUsuarioSecretaria --- Devuelve los datos de todas las secretarias
exports.getListaUsuarioSecreatria = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT P.id_persona, P.nombre, P.correo ,P.edad, P.direccion, P.telefono,U.id_e_us, U.id_t_us
      FROM PERSONA AS P 
      INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
      WHERE U.id_t_us=3
      AND U.id_e_us=2`
    );

    if (result.length == 0)
      return res.status(400).json({
        message: "No se encontró ninguna Secretaria registrada. ",
      });

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener los datos de las secretarias. ",
      descirption: error,
    });
  }
};
