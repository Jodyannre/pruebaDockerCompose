import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const medicamentosSlice = createSlice({
  name: "medicamentos",
  initialState: {
    medicamentos: [],
    loadingMedicamento: false,
    errorMedicamento: false,
  },
  reducers: {
    setMedicamentos: (state, action) => {
      state.medicamentos = action.payload;
    },
    setLoading: (state, action) => {
      state.loadingMedicamento = action.payload;
    },
    setError: (state, action) => {
      state.errorMedicamento = action.payload;
    },
  },
});

export const { setMedicamentos, setLoading, setError } =
  medicamentosSlice.actions;

export default medicamentosSlice.reducer;

export const fetchMedicamentos = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_MEDICOS}/api/medicamento`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    dispatch(setMedicamentos(response.data));
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
