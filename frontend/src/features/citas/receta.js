import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const createReceta = (receta) => async (dispatch) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/receta`,
      receta,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    Swal.fire("Creado", "La receta se creó correctamente", "success");
  } catch (error) {
    if (error.response.status === 403) {
      Swal.fire({
        icon: "error",
        title: "No tienes permisos para acceder a esta sección",
        text: "Porfavor vuelve a iniciar sesión",
        confirmButtonText: "Aceptar",
      }).then(() => {
        logout();
      });
    }
    Swal.fire({ icon: "error", title: "Error al crear receta" });
  }
};
