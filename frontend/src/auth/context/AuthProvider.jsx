import { SHA256 } from "crypto-js";
import { useEffect, useState } from "react";
import { useReducer } from "react";
import { loginTypes } from "../../types/loginTypes";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";

const init = () => {
  //get user from session storage
  const user = JSON.parse(sessionStorage.getItem("user"));
  return {
    logged: !!user,
    user: user,
  };
};
export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {}, init);
  const [userType, setUser] = useState("");

  const login = async (user, pass) => {
    //verificacion de usuario con fetch
    const newPassword = SHA256(pass).toString();
    console.log(newPassword);
    const requestOps = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuarioIN: user,
        pass: newPassword,
      }),
    };

    const resp = await fetch(
      import.meta.env.VITE_SERVICE_SESION + "/api/user/login",
      requestOps
    );
    const data = await resp.json();
    console.log(data);
    const { userInfo, accessToken } = data;
    const { id_t_us, nombre, id } = userInfo;
    const action = {
      type: loginTypes.login,
      payload: {
        id: id_t_us,
        id_usuario: id,
        userType:
          id_t_us === 1
            ? "admin"
            : id_t_us === 2
            ? "doctor"
            : id_t_us === 3
            ? "secretaria"
            : "client",
        name: nombre,
      },
    };
    //set user to session storage
    sessionStorage.setItem("user", JSON.stringify(action.payload));
    sessionStorage.setItem("token", accessToken);
    dispatch(action);
  };

  const logout = () => {
    const action = {
      type: loginTypes.logout,
    };
    //remove user from session storage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    dispatch(action);
  };
  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
