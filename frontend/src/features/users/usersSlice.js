import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";
import sha256 from "crypto-js/sha256";

import { useContext } from "react";
import { AuthContext } from "../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    medicos: [],
    secretarias: [],
    pacientes: [],
    aspirantes: [],
    loading: false,
    error: false,
  },
  reducers: {
    setMedicos: (state, action) => {
      state.medicos = action.payload;
    },
    setSecretarias: (state, action) => {
      state.secretarias = action.payload;
    },
    setPacientes: (state, action) => {
      state.pacientes = action.payload;
    },
    setAspirantes: (state, action) => {
      state.aspirantes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMedicos,
  setSecretarias,
  setPacientes,
  setAspirantes,
  setLoading,
  setError,
} = usersSlice.actions;

export default usersSlice.reducer;

export const createUser = (user) => async (dispatch) => {
  user = {
    ...user,
    password: sha256(user.password).toString(),
    password2: sha256(user.password2).toString(),
  };
  console.log(user);
  dispatch(setLoading(true));
  try {
    await axios.post(`${import.meta.env.VITE_SERVICE_SESION}/api/user`, user, {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    if (user.tipo === 2) {
      dispatch(fetchMedicos());
    } else if (user.tipo === 3) {
      dispatch(fetchSecretarias());
    } else if (user.tipo === 4) {
      dispatch(fetchAspirantes());
    }
    Swal.fire("Creado", "El usuario se creó correctamente", "success");
  } catch (error) {
    dispatch(setError(true));
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

    Swal.fire("Error!", error.response.data.message, "error");
  }
  dispatch(setLoading(false));
};

export const updateState = (id, estado, tipo) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.put(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/user`,
      {
        idUsuario: id,
        estado: estado,
      },
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    if (tipo === "medico") {
      dispatch(fetchMedicos());
    } else if (tipo === "secretaria") {
      dispatch(fetchSecretarias());
    } else if (tipo === "paciente") {
      dispatch(fetchPacientes());
    } else if (tipo === "aspirante") {
      dispatch(fetchAspirantes());
      dispatch(fetchPacientes());
    }
    Swal.fire(
      "Actualizado",
      "El usuario se actualizó correctamente",
      "success"
    );
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
    Swal.fire("Error!", error.response.data.message, "error");
  }
  dispatch(setLoading(false));
};

export const fetchMedicos = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/user/2`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(data);
    dispatch(setMedicos(data));
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
    dispatch(setError(error.response.data.message));
  }
};

export const fetchSecretarias = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/user/3`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setSecretarias(data));
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
    dispatch(setError(error.response.data.message));
  }
};

export const fetchPacientes = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/user/4`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setPacientes(data));
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
    dispatch(setError(error.response.data.message));
  }
};

export const fetchAspirantes = () => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/user/5`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setAspirantes(data));
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
    dispatch(setError(error.response.data.message));
  }
};
