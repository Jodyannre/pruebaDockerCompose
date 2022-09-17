import { setOcupados } from "./salaSlice";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const fetchOcupados = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_SECRETARIA}/api/medico/salas`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setOcupados(response.data));
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
    console.log(error);
  }
};
