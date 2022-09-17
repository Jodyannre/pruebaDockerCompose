import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const citasSlice = createSlice({
  name: "citas",
  initialState: {
    citas: [],
    historyCitas: [],
    loadingCita: false,
    errorCita: false,
    loadingPendientes: false,
    loadingHistorial: false,
  },
  reducers: {
    setCitas: (state, action) => {
      state.citas = action.payload;
    },
    setHistoryCitas: (state, action) => {
      state.historyCitas = action.payload;
    },
    setLoading: (state, action) => {
      state.loadingCita = action.payload;
    },
    setError: (state, action) => {
      state.errorCita = action.payload;
    },
    setLoadingPendientes: (state, action) => {
      state.loadingPendientes = action.payload;
    },
    setLoadingHistorial: (state, action) => {
      state.loadingHistorial = action.payload;
    },
  },
});

export const {
  setCitas,
  setLoading,
  setError,
  setHistoryCitas,
  setLoadingHistorial,
  setLoadingPendientes,
} = citasSlice.actions;

export default citasSlice.reducer;

export const fetchHistoryCitas = (id, tipo) => async (dispatch) => {
  dispatch(setLoadingHistorial(true));
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVICE_CLIENT
      }/api/citas/history/${id}/${tipo}/nulo`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setHistoryCitas(response.data));
    console.log("history", response.data);
  } catch (error) {
    dispatch(setLoadingHistorial(false));
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
  dispatch(setLoadingHistorial(false));
};

export const fetchCitas = (id, tipo) => async (dispatch) => {
  dispatch(setLoadingPendientes(true));
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/citas/${id}/${tipo}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    dispatch(setCitas(response.data));
  } catch (error) {
    dispatch(setLoadingPendientes(false));
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
  dispatch(setLoadingPendientes(false));
};

export const createCita = (cita, id, tipo) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(false));
  try {
    await axios.post(`${import.meta.env.VITE_SERVICE_CLIENT}/api/cita`, cita, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    dispatch(fetchCitas(id, tipo));
    Swal.fire("Creado", "La cita se creó correctamente", "success");
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
    Swal.fire({ icon: "error", title: "Error al crear cita" });
    dispatch(setError(true));
  }
  dispatch(setLoading(false));
};

export const updateCita = (id, idMotivo) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(false));
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/cita`,
      {
        motivo: idMotivo,
      },
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(fetchCitas(id, "Medico"));
    dispatch(fetchHistoryCitas(id, "Medico"));
    Swal.fire({
      icon: "success",
      title: "Cita actualizada correctamente",
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
    Swal.fire({ icon: "error", title: "Error al actualizar cita" });
    dispatch(setError(true));
  }
  dispatch(setLoading(false));
};
