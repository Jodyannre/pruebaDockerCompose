const express = require('express')
const app = express()
const PORT = 4000
const axios = require('axios')


app.get('/', (req,res) => {
    res.json({message:"Hola mundo"});
})

app.listen(PORT, ()=>{
    console.log(`App corriendo en el puerto ${PORT}`)
})
