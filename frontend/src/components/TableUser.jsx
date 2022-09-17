import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Swal from "sweetalert2";
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from "react-redux";
import { updateState } from "../features/users/usersSlice";

function TableUser({ tipo, users }) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.users);

  const handleStatus = (id, nombre, status) => {
    console.log(id, status);  
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Deseas dar de *${
        status === 2 ? "Alta" : "Baja"
      }* al usuario *${nombre}*?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20bbcce1",
      cancelButtonColor: "#ff902f",
      confirmButtonText: "Si, cambiar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        dispatch(updateState(id, status, tipo));
      }
    });
  };

  const style = {
    top: 0,
    left: 0,
    zIndex: 10,
    height: "2.5rem",
    position: "sticky",
    color: "#000",
    backgroundColor: "#fff",
  };

  return (
    <>
      <Container style={{ marginTop: "1rem" }}>
      <h1>Lista de {tipo}s</h1>
        <div
          style={{
            marginTop: "40px",
            overflowY: "auto",
            height: "calc(85vh - 100px)",
          }}
        >
          <Table hover size="lg">
            <thead>
              <tr>
                <th style={style}>#</th>
                <th style={style}>Nombre</th>
                <th style={style}>Usuario</th>
                <th style={style}>Correo</th>
                <th style={style}>Edad</th>
                <th style={style}>Direccion</th>
                <th style={style}>Telefono</th>
                {tipo === "medico" && <th style={style}>Especialidad</th>}
                <th style={style}>{ loading ? <Spinner animation="border" variant="dark" /> : "Acciones" }</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.nombre}</td>
                  <td>{item.usuario}</td>
                  <td>{item.correo}</td>
                  <td>{item.edad}</td>
                  <td>{item.direccion}</td>
                  <td>{item.telefono}</td>
                  {tipo === "medico" ? <td>{item.especialidad}</td> : null}
                  <td>
                    {tipo === "aspirante" ? (
                      <Button
                        disabled={loading}
                        onClick={() => handleStatus(item.id, item.nombre, 2)}
                        size="sm"
                        style={{
                          backgroundColor: "#fff",
                          borderColor: "#ff902f ",
                          color: "#000",
                        }}
                      >
                        Aceptar ✅
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          handleStatus(item.id, item.nombre, item.estado === 2 ? 3 : 2)
                        }
                        disabled={loading}
                        size="sm"
                        style={
                          item.estado === 2
                            ? {
                                backgroundColor: "#fff",
                                borderColor: "#20bbcce1 ",
                                color: "#000",
                              }
                            : {
                                backgroundColor: "#fff",
                                borderColor: "#ff902f ",
                                color: "#000",
                              }
                        }
                      >
                        {item.estado === 2
                          ? "Dar de baja ⛔️"
                          : "Dar de alta ✅"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
}

export default TableUser;
