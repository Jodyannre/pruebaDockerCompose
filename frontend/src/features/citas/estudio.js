import { fetchHistoryCitas, setLoading, setError } from "./citaSlice";
import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const createStudie = (estudio, id) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(false));
  try {
    const resp = await axios.post(
      `${import.meta.env.VITE_SERVICE_MEDICOS}/api/estudio`,
      estudio,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(resp);
    dispatch(fetchHistoryCitas(id, "Medico"));
    Swal.fire("Creado", "El estudio se creó correctamente", "success");
  } catch (error) {
    dispatch(setLoading(false));
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
    Swal.fire({ icon: "error", title: "Error al crear estudio" });
    dispatch(setError(true));
  }
  dispatch(setLoading(false));
};

export const deleteStudie = (id, idCita) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(false));
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/estudio/${id}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(fetchHistoryCitas(idCita));
    Swal.fire({
      icon: "success",
      title: "Estudio eliminado con éxito",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    dispatch(setLoading(false));
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
    Swal.fire({
      icon: "error",
      title: "Error al eliminar estudio",
      showConfirmButton: false,
      timer: 1500,
    });
    dispatch(setError(true));
  }
  dispatch(setLoading(false));
};
