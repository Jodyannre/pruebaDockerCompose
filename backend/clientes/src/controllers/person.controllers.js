const db = require("../db/database");

//get Persona --- Devuelve los datos de la entidad Persona según el id
exports.getPersona = async (req, res) => {
  try {
    const data = req.body;
    const result = await db.query(
      `SELECT P.id_persona, P.nombre, P.correo ,P.edad, P.direccion, P.telefono, M.id_especialidad, C.id_t_cl, U.id_e_us, U.id_t_us
      FROM PERSONA AS P 
      LEFT JOIN MEDICO AS M ON M.id_persona=P.id_persona
      LEFT JOIN CLIENTE AS C ON C.id_persona=P.id_persona
      LEFT JOIN USUARIO AS U ON U.id_persona=P.id_persona
      WHERE P.id_persona =${data.id_persona}`
    );

    if (result.length == 0)
      return res.status(400).json({
        message: "No se encontró ninguna persona con este id. ",
      });
    req.data = {
      message: `Datos de la persona con id ${data.id_persona}`,
      data: result[0],
    };
    req.error = "No";
    next()
    return res.status(200).json({
      message: `Datos de la persona con id ${data.id_persona}`,
      data: result[0],
    });
  } catch (error) {
    req.data = {
      message: "Error al obtener los datos de la persona. ",
      descirption: error,
    };
    req.error = "Si";
    next()
    return res.status(400).json({
      message: "Error al obtener los datos de la persona. ",
      descirption: error,
    });
  }
};
