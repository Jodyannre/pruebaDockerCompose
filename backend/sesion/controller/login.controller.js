require('dotenv').config()
const { json } = require('body-parser')
const db = require('../conexionDB/conexion')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { application } = require('express')

exports.getUsers = async (req, res) => {
  try {
    let { id_user } = req.body
    let sql = ''

    sql = `select * from USUARIO`

    const result = await db.query(sql)
    return res.json(result)
  } catch (err) {
    console.log(err)
    return { msg: 'error getting users' }
  }
}

/**
 *  tipoUsuarioIN INT,
    nombreIN VARCHAR(100),
    correoIN VARCHAR(100),
    edadIN INT,
    direccionIN VARCHAR(100),
    telefonoIN VARCHAR(100),
    passIN VARCHAR(256),
    nombreUsuarioIN VARCHAR(100),
    especialidadIN INT,
    horarioIN INT
    tipoUsuario
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.createUser = async (req, res) => {
  console.log(req.body)
  try {
    console.log('entrando')
    let {
      nombre,
      usuario,
      correo,
      edad,
      direccion,
      telefono,
      password,
      horario,
      especialidad,
      tipo,
    } = req.body
    console.log(
      nombre,
      usuario,
      correo,
      edad,
      direccion,

      telefono,
      password,
      horario,
      especialidad,
      tipo
    )
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    let sql = `CALL crearPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const result = await db.query(sql, [
      tipo,
      nombre,
      correo,
      edad,
      direccion,
      telefono,
      hashedPassword,
      usuario,
      especialidad,
      horario,
    ])
    console.log('paso el procedimiento')
    console.log(req.body)

    let user = await db.query(`SELECT id_usuario FROM USUARIO WHERE nombre_usuario = "${usuario}"`)
    console.log(user);
    return res.json([
      [
          {
              "resultado": result[0][0].resultado
          }
      ],
      [{
        "id_usuario" : user[0].id_usuario
  }]
  ])
  } catch (error) {
    console.log(error)
    res.status(500).send()
  }
}

exports.logIn = async (req, res) => {
  let { usuarioIN, pass } = req.body
  console.log(usuarioIN, pass)
  let sql = ''
  sql = `select * from USUARIO where nombre_usuario = '${usuarioIN}'`
  const user = await db.query(sql)
  console.log(user)
  if(user.length == 0 ) return res.json({message: "usuario no encontrado"});
  const user_info = {
    id: user[0].id_usuario,
    nombre: user[0].nombre_usuario,
    id_persona: user[0].id_persona,
    id_e_us: user[0].id_e_us,
    id_t_us: user[0].id_t_us,
  }
  try {
    console.log(pass, user[0].pass)
    if (await bcrypt.compare(pass, user[0].pass)) {
      //console.log(user);
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '18000s',
      })
      res.json({ accessToken: accessToken, userInfo: user_info })
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
}

exports.middlewareTes = (req, res) => {
  res.json({ message: 'post success... it was autorizated' })
}
