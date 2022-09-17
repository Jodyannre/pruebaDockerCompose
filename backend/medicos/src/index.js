const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const PORT = process.env.PORT || 3000;

//import Router from 'rutaDelRouter'
const estudio = require("./routes/estudio.routes");
const medicamento = require("./routes/medicamento.routes");
const cita = require("./routes/cita.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(authenticateToken);

app.use("/api/estudio", estudio);
app.use("/api/medicamento", medicamento);
app.use("/api/actual/cita", cita);

app.get("/", function (req, res) {
  res.send("Hola mundo");
});

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
