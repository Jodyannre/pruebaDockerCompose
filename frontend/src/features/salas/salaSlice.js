import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const salaSlice = createSlice({
  name: "salas",
  initialState: {
    salas: [],
    ocupados: [],
    loadingSala: false,
    errorSala: false,
  },
  reducers: {
    setSalas: (state, action) => {
      state.salas = action.payload;
    },
    setOcupados: (state, action) => {
      state.ocupados = action.payload;
    },
  },
});

export const { setSalas, setOcupados } = salaSlice.actions;

export default salaSlice.reducer;

export const fetchSalas = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_SECRETARIA}/api/salas`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setSalas(response.data));
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
    dispatch(setError(true));
  }
};
