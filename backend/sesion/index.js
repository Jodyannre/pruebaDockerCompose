var express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const jwt = require('jsonwebtoken')

const endpoints = require('./routes/login.routes')
const { json } = require('body-parser')

app.set('port', 3005)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/user', endpoints)

//Routes
//app.use('/middleware',Router);

app.get('/', function (req, res) {
  res.send('Hola mundo')
})

//incio app
app.listen(app.get('port'), () => {
  console.log('Server running on port')
})



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