const db = require("../db/database");
var nodemailer = require("nodemailer");

/**
 *
 * @parametros
 *  Fecha dd-mm-yyyy
 *  idMascota
 *  idTipoCita: 1 Nomrmal, 2 Emergencia
 *
 */
exports.postCita = async (req, res,next) => {
  try {
    //let fecha = getFecha();
    // idcliente, motivos, idMedico, idSala, id_mascota,tipo: 1. Normal, 2. Emergencia
    console.log(req.body);
    let { idMascota, motivos, tipo, fecha } = req.body;

    let sql = `CALL crearCita ('${fecha}',${idMascota},${tipo})`;

    const result = await db.query(sql);
    const { idCita } = result[0][0];
    if (tipo != 1) {
      return res.status(200).json({ message: "Cita creada exitosamente!" });
    }
    for (let index = 0; index < motivos.length; index++) {
      // inicio, fin, idMotivo
      let motivo = motivos[index];
      const resultMotivo = await db.query(
        `CALL agregarMotivo ('${motivo.inicio}',${motivo.idMotivo},${motivo.idSala},${idCita},${motivo.idMedico})`
      );
      console.log(resultMotivo[0][0].resultado);
    }
    const resultCliente = await db.query(`SELECT P.correo
    FROM MASCOTA AS M, MA_D AS MD, USUARIO AS U, PERSONA AS P
    WHERE MD.id_mascota=M.id_mascota
    AND U.id_usuario=MD.id_usuario 
    AND U.id_persona=P.id_persona
    AND M.id_mascota=${idMascota};`);

    const email = resultCliente[0].correo;
    sende(
      email,
      "Cita aprobada",
      "Por este medio le confirmo la cita de su mascota."
    );
    req.data = {"message": "Cita Creada!"};
    req.error = "No";
    next()
    return res.status(200).json({ message: "Cita Creada!" });
  } catch (error) {
    console.log(error);
    req.data = { message: "error posting cita", description: error };
    req.error = "Si";
    next()
    return res
      .status(500)
      .json({ message: "error posting cita", description: error });
  }
};


/**
 *
 * @parametros
 *
 * motivo varchar
 * accion int : 1 Activar Motivo
 */
exports.updateCitaEstado = async (req, res,next) => {
  console.log("ejecutando cita");
  try {
    let { motivo } = req.body;
    console.log(motivo);
    let sql = `CALL actualizarMotivo (${motivo},2)`;
    const result = await db.query(sql);
    console.log(result);
    if (result[0][0].resultado != 1)
      return res.status(400).json({ message: "no se puede finalizar" });
    req.data ={ message: "cita finalizada" };
    req.error = "No";
    next()
    return res.json({ message: "cita finalizada" });
  } catch (error) {
    console.log(error);
    req.data = { msg: "error updating estado cita" };
    req.error = "Si";
    next();
    return res.status(500).json({ msg: "error updating estado cita" });
  }
};

/**
 *
 * @parametros
 * horaInicio HH:mm:ss
 * id_motivo 1 G, 2 T, 3 O, 4 G, 5 L
 * id_sala
 * id_cita
 * id_medico
 */
exports.postMotivo = async (req, res) => {
  try {
    let { hora, motivo, sala, cita, medico } = req.body;
    let sql = `CALL agregarMotivo ('${hora}',${motivo},${sala},${cita},${medico})`;
    const result = await db.query(sql);
    if (result[0][0].resultado) {
      return res.status(200).json(result[0][0]);
    } else {
      return res.status(400).json({ msg: "error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "eror posting Motivo Cita" });
  }
};

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

exports.enpoint_test = async (req,res,next) =>{
  console.log("enpoint test");
  let data = "respuesta del enpoint";
  //console.log(data);
  req.data ={ "message" : "cita finalizada" };
  req.error = "No";
  console.log(req.info);
  console.log(req.is_error);
  next();
  res.status(200).json(data);
}

exports.logsIn_midlwr = async (req,res) => {
 try {
    let route = req.originalUrl;
    //loop a json object
    // for(var attributename in data_in){
    //    cad += attributename+": "+data_in[attributename];
    // }
    let sql =  `CALL insert_log("${route}",'${JSON.stringify(req.body)}','${JSON.stringify(req.data)}',"${req.error}");`
    const id_log = await db.query(sql);
    console.log(id_log);
    console.log(id_log[0][0].resp);
 } catch (error) {
    console.log(error);
 }

}
