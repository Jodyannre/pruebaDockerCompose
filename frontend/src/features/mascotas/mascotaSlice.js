import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const mascotaSlice = createSlice({
  name: "mascotas",
  initialState: {
    mascotas: [],
    loadingMascota: false,
    errorMascota: false,
  },
  reducers: {
    setMascotas: (state, action) => {
      state.mascotas = action.payload;
    },
    setLoading: (state, action) => {
      state.loadingMascota = action.payload;
    },
    setError: (state, action) => {
      state.errorMascota = action.payload;
    },
  },
});

export const { setMascotas, setLoading, setError } = mascotaSlice.actions;

export default mascotaSlice.reducer;

export const fetchMascotas = (id) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_SECRETARIA}/api/mascotas/${id}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setMascotas(response.data));
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
