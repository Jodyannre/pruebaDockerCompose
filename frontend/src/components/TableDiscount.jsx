import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";

import {
  updateDiscount,
  deleteDiscount,
} from "../features/discounts/discountSlice";

function TableDiscount({ discounts }) {
  const dispatch = useDispatch();
  const [submit, setSubmit] = useState(false);
  const { loading } = useSelector((state) => state.discounts);

  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Deseas eliminar el descuento *${nombre}*?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#20bbcce1",
      cancelButtonColor: "#ff902f",
      confirmButtonText: "Si, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        dispatch(deleteDiscount(id));
      }
    });
  };

  const handleCantidad = (id, nombre) => {
    Swal.fire({
      title: "Ingrese la nueva cantidad del descuento " + nombre,
      input: "number",
      inputAttributes: {
        min: 0,
        max: 100,
        step: 1,
      },
      showCancelButton: true,
      confirmButtonColor: "#20bbcce1",
      cancelButtonColor: "#ff902f",
      confirmButtonText: "Si, cambiar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        dispatch(updateDiscount({ id, cantidad: result.value }));
        setSubmit(true);
      }
    });
  };

  useEffect(() => {
    if (loading && submit) {
      Swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      setSubmit(false);
      Swal.close();
    }
  }, [loading]);

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
        <h1>Lista de descuentos</h1>
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
                <th style={style}>Cantidad</th>
                <th style={style}>Estado</th>
                <th style={style}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount, index) => (
                <tr key={discount.id}>
                  <td>{index + 1} </td>
                  <td>{discount.nombre}</td>
                  <td>{discount.cantidad}</td>
                  <td>{discount.estado === 1 ? "Activo" : discount.estado === 2 ? "Inactivo" : "Eliminado"}</td>
                  <td>
                    <Button
                      size="sm"
                      disabled={discount.estado === 3}
                      style={{
                        marginLeft: "5px",
                        backgroundColor: "#fff",
                        borderColor: "#ff902f",
                        color: "#000",
                      }}
                      onClick={() => handleDelete(discount.id, discount.nombre)}
                    >
                      Eliminar
                    </Button>
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

export default TableDiscount;
