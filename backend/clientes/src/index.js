const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const db = require("./db/database");
const PORT = process.env.PORT || 3002;


//import Router from 'rutaDelRouter'
//const person = require("./routes/person.routes");
const pacientes = require("./routes/pacientes.routes");
const receta = require("./routes/receta.routes");
const citas = require("./routes/cita.routes");
const historial = require("./routes/hisotrial.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//Routes
//app.use("/api/user", person);

app.use(authenticateToken);

app.use("/api/pet", pacientes);

app.use("/api/cita", citas);

app.use("/api/receta", receta);

app.use("/api/citas", historial);

app.use(logsIn_midlwr);

app.use("/static", express.static("src/assets/exp"));


app.get("/", function (req, res) {
  res.send("Hola mundo Paciente");
});


async function logsIn_midlwr (req,res,next) {
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

//incio app
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

function authenticateToken(req, res, next) {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log("cheking token");
  console.log(token);
  if (token == null) return res.sendStatus(401); //there is no token to be valueted

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // the token is not longer value
    //here I can check from de data base
    req.user = user;
    console.log(user);
    next();
  });
}