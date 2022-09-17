const multer = require("multer");
const db = require("../db/database");

exports.uploadImage = async (req, res) => {
  console.log(req.params);
  const { id, carpeta } = req.params;
  let name;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      carpeta == "exp" ? cb(null, "src/assets/exp") : cb(null, "src/assets");
    },
    filename: function (req, file, cb) {
      name = id + "-" + file.originalname;
      cb(null, name);
    },
  });
  var upload = multer({ storage: storage }).single("file");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
  });
  /*try {
    const result = await db.query("CALL sp_uploadImage(?,?)", [id, name]);
    return res.status(200).json({ message: "Imagen subida correctamente" });
  } catch (error) {
    return res.status(400).json({
      message: "Error al subir la imagen. ",
      descirption: error,
    });
  }*/
  return res.status(200).json({ message: "Imagen subida correctamente" });
};
