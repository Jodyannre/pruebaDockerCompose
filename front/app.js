const express = require('express')
const app = express()
const PORT = 3000
const axios = require('axios')
require('dotenv').config()

app.use(express.json())

app.get('/', async (req,res) => {
    const respuesta = await peticion();
    res.json(respuesta);
    
})

app.listen(PORT, ()=>{
    console.log(`App corriendo en el puerto ${PORT}`)
})


async function peticion(){
    const config = {
        method: 'get',
        url: process.env.DIRECCION
    }
    const res = await axios(config)
    return res.data 
}