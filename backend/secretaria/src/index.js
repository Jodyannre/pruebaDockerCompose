var express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const app = express();

// require("dotenv/config");
// const PORT = process.env.PORT || 3004;

//import Router from 'rutaDelRouter'
const endpoints = require("./routes/raza.routes");
const medico = require("./routes/medico.routes");
const sala = require("./routes/sala.routes");
const mascota = require("./routes/mascota.routes");
const pagos = require("./routes/pagos.routes");

app.set("port", 3004);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authenticateToken);
app.use("/api/raza", endpoints);
app.use("/api/medico", medico);
app.use("/api/salas", sala);
app.use("/api/mascotas", mascota);
app.use("/api/pagos", pagos);

//Routes
// app.use("/api/user", secretaria);

app.get("/", function (req, res) {
  res.send("Hola mundo desde el serivdor de sercretaria");
});

//incio app
app.listen(app.get("port"), () => {
  console.log("Server running on port");
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