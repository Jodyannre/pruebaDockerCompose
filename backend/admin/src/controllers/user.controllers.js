const db = require("../db/database");

//getlistadoUsuarios --- Devuelve los datos de todos los usuarios del sistema {1:Admin, 2:Medico, 3:Secretaria, 4:Cliente (2 de alta / 3 baja), 5:Aspirante (1 pendiente)}
exports.getListaUsuarios = async (req, res) => {
  try {
    let sql_query = "";
    const { rol } = req.params;
    if (rol == 1) {
      //Admin
      sql_query = `SELECT P.id_persona as id, P.nombre, P.correo ,P.edad, P.direccion, P.telefono,U.id_e_us as estado, U.id_t_us, U.id_usuario
    FROM PERSONA AS P
    INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
    WHERE U.id_t_us=1`;
    } else if (rol == 2) {
      //Médico dado de alta y baja en el sistema
      sql_query = `SELECT P.id_persona as id, P.nombre, U.nombre_usuario as usuario, 
      P.correo ,P.edad, P.direccion, P.telefono, M.id_especialidad as especialidad, 
      U.id_e_us as estado, U.id_t_us, U.id_usuario,
      H.nombre as Horario, H.inicio as HoraIni, H.fin as HoraFin, D.nombre as Dia
          FROM PERSONA AS P
          INNER JOIN MEDICO AS M ON M.id_persona=P.id_persona
          INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
          INNER JOIN H_L AS HL ON HL.id_persona=P.id_persona
          INNER JOIN HORARIO AS H ON H.id_horario=HL.id_horario
          INNER JOIN DIA AS D ON HL.id_dia=D.id_dia`;
    } else if (rol == 3) {
      // Secretaria data de alta y baja en el sistema
      sql_query = `SELECT P.id_persona as id, P.nombre,U.nombre_usuario as usuario, P.correo ,P.edad, P.direccion, P.telefono,U.id_e_us as estado, U.id_t_us, U.id_usuario
    FROM PERSONA AS P
    INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
    WHERE U.id_t_us=3`;
    } else if (rol == 4) {
      //Clientes dados de alta o baja
      sql_query = `SELECT P.id_persona as id, P.nombre,U.nombre_usuario as usuario, P.correo ,P.edad, P.direccion, P.telefono, M.id_especialidad, C.id_t_cl, U.id_e_us as estado, U.id_t_us, U.id_usuario
      FROM PERSONA AS P
      LEFT JOIN MEDICO AS M ON M.id_persona=P.id_persona
      LEFT JOIN CLIENTE AS C ON C.id_persona=P.id_persona
      INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
      WHERE U.id_t_us=4
      AND U.id_e_us IN (2,3)`;
    } else if (rol == 5) {
      sql_query = `SELECT P.id_persona as id, P.nombre,U.nombre_usuario as usuario, P.correo ,P.edad, P.direccion, P.telefono, M.id_especialidad, C.id_t_cl, U.id_e_us as estado, U.id_t_us, U.id_usuario
    FROM PERSONA AS P
    LEFT JOIN MEDICO AS M ON M.id_persona=P.id_persona
    LEFT JOIN CLIENTE AS C ON C.id_persona=P.id_persona
    INNER JOIN USUARIO AS U ON U.id_persona=P.id_persona
    WHERE U.id_e_us=1`;
    } else {
      return res.status(400).json({
        message:
          "No se identifico correctamente el rol de usuario del que desea obtener informacion. ",
      });
    }

    const result = await db.query(sql_query);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener los datos de los usuarios. ",
      descirption: error,
    });
  }
};

//getListaPersonas --- Devuelve los datos de todas las personas
exports.getListaPersonas = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT P.id_persona, P.nombre, P.correo ,P.edad, P.direccion, P.telefono, M.id_especialidad, C.id_t_cl, U.id_e_us, U.id_t_us
      FROM PERSONA AS P
      LEFT JOIN MEDICO AS M ON M.id_persona=P.id_persona
      LEFT JOIN CLIENTE AS C ON C.id_persona=P.id_persona
      LEFT JOIN USUARIO AS U ON U.id_persona=P.id_persona`
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Error al obtener los datos de las personas. ",
      descirption: error,
    });
  }
};

//updateEstadoUsuarios --- Devuelve los datos de todos los usuarios en lista de espera
exports.updateEstadoUsuarios = async (req, res) => {
  try {
    console.log(req.body);
    const data = req.body;
    let arrayParams = [data.idUsuario, data.estado];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message:
          "Error, datos incompletos. Se requiere id del usuario y el nuevo estado al que se desea cambiar",
      });

    const result = await db.query(
      `CALL actualizarEstadoUsuario (${data.idUsuario}, ${data.estado})`
    );

    const resultCliente = await db.query(`SELECT P.correo
    FROM USUARIO AS U, PERSONA AS P
    WHERE U.id_persona=P.id_persona
    AND U.id_usuario=${data.idUsuario};`);

    const email = resultCliente[0].correo;
    sende(
      email,
      "Usuario Gatifu aprobado",
      "Por este medio se le confirma la aprobación de su usario en la página de Gatifu.\nGracias por preferirnos!"
    );
    return res.status(200).json({ message: "Estado Usuario Modificado!" });
  } catch (error) {
    return res.status(400).json({
      message: "Error al modificar estado. ",
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

function getFecha() {
  let date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (month < 10) {
    return `${day}-0${month}-${year}`;
  } else {
    return `${day}-${month}-${year}`;
  }
}

async function sende(email, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "a.annelis@gmail.com",
      pass: "oplgphnvxmxctvhx",
    },
  });

  let info = {
    from: '"Gatifu Hospital" <a.annelis@gmail.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    html: `<body>${text}</body>`, // html body
  };

  transporter.sendMail(info, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
