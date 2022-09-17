import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "../features/users/usersSlice";
import discountsSlice from "../features/discounts/discountSlice";
import mascotaSlice from "../features/mascotas/mascotaSlice";
import medicamentosSlice from "../features/medicamentos/medicamentosSlice";
import salaSlice from "../features/salas/salaSlice";
import citaSlice from "../features/citas/citaSlice";


export const store = configureStore({
  reducer: {
    discounts: discountsSlice,
    users: usersSlice,
    mascotas: mascotaSlice,
    medicamentos: medicamentosSlice,
    salas: salaSlice,
    citas: citaSlice,
  }
});
