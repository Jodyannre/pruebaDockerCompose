import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
const { logout } = useContext(AuthContext);

export const discountsSlice = createSlice({
  name: "discounts",
  initialState: {
    discounts: [],
    loadingDiscount: false,
    errorDiscount: false,
  },
  reducers: {
    setDiscounts: (state, action) => {
      state.discounts = action.payload;
    },
    setLoading: (state, action) => {
      state.loadingDiscount = action.payload;
    },
    setError: (state, action) => {
      state.errorDiscount = action.payload;
    },
  },
});

export const { setDiscounts, setLoading, setError } = discountsSlice.actions;

export default discountsSlice.reducer;

export const fetchDiscounts = () => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/descuento`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(setDiscounts(response.data));
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

export const createDiscount = (discount) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(false));
  try {
    await axios.post(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/descuento`,
      discount,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(fetchDiscounts());
    Swal.fire("Creado", "El descuento se creó correctamente", "success");
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
    Swal.fire({ icon: "error", title: "Error al crear descuento" });
    dispatch(setError(true));
  }
  dispatch(setLoading(false));
};

export const deleteDiscount = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(false));
  try {
    await axios.delete(
      `${import.meta.env.VITE_SERVICE_ADMIN}/api/descuento/${id}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    dispatch(fetchDiscounts());
    Swal.fire({
      icon: "success",
      title: "Descuento eliminado con éxito",
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
      title: "Error al eliminar descuento",
      showConfirmButton: false,
      timer: 1500,
    });
    dispatch(setError(true));
  }
  dispatch(setLoading(false));
};
