const db = require("../db/database");

//getReceta --- Devuelve receta,fecha,motivo,medico,medicina
exports.getReceta = async (req, res,next) => {
  try {
    const { idMascota } = req.params;
    req.body = req.params;
    let arrayParams = [idMascota];
    if (!notUndefinedNull(arrayParams))
      return res.status(400).json({
        message: "Error, datos incompletos. Se requiere idMascota",
      });
    
    const result = await db.query(`CALL obtenerRecetas (${idMascota})`);
    console.log(result);
    req.data ={ message: "Datos Receta Obtenidos con éxito!" };
    req.error = "No";
    next()
    return res
      .status(200)
      .json({ message: "Datos Receta Obtenidos con éxito!" });
  } catch (error) {
    req.data ={
      message: "Error al obtener datos Receta. ",
      descirption: error,
    };
    req.error = "Si";
    next()
    return res.status(400).json({
      message: "Error al obtener datos Receta. ",
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


/**
 * se crea receta que vincula a la cita
 *  idMotivo <<es decir id detalle motivo>>
    descripcion
    medicamentos: []
 */

    exports.receta_create = async (req,res,next) =>{
      try {
        let {idMotivo,descripcion,medicamentos} = req.body;
        let sql = `CALL crearReceta (${idMotivo},"${descripcion}");`;
        const result = await db.query(sql);
        console.log(result[0][0].receta);
        console.log(medicamentos);
  
        await asynForEach(medicamentos, async (medicamento) => {
          //here i dadd a student info
          const resp = await db.query(
            `INSERT INTO D_RE (id_medicamento,id_receta) VALUES (${medicamento},${result[0][0].receta});`
          );
          console.log(resp.affectedRows);
        });
        req.data ={message:"receta creada con exito"};
        req.error = "No";
        next()  
        return res.status(200).json({message:"receta creada con exito"});

      } catch (error) { 
        console.log(error);
        req.data ={message:"error al crear receta"};
        req.error = "Si";
        next()  
        return res.status(500).json({message:"error al crear receta"});
      }

    }

    async function asynForEach(array,callback){
      for (let index = 0; index < array.length; index++) {
        await callback(array[index],index,array);
      }
    }
  

