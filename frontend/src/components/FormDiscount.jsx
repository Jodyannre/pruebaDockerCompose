import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import AlertDismissible from "./Alert";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { createDiscount, setError } from "../features/discounts/discountSlice";

function FormDiscount() {
  const { loadingDiscount } = useSelector((state) => state.discounts);
  const { errorDiscount } = useSelector((state) => state.discounts);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [submit, setSubmit] = useState(false);

  const [NewDescuento, setNewDescuento] = useState({
    nombre: "",
    cantidad: "",
  });

  const handleChange = (e) => {
    setNewDescuento({
      ...NewDescuento,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (NewDescuento.nombre === "" || NewDescuento.cantidad === "") {
      setShow(true);
      setMessage("Todos los campos son obligatorios");
      setTimeout(() => {
        setShow(false);
      }, 5000);
      return;
    }
    setSubmit(true);
    dispatch(createDiscount(NewDescuento));
  }

  useEffect(() => {
    if (loadingDiscount === false && submit === true) {
      if (errorDiscount) {
        setError(false);
        return;
      }
      setNewDescuento({
        nombre: "",
        cantidad: "",
      });
      setSubmit(false);
    }
  }, [loadingDiscount]);


  return (
    <Container style={{ marginTop: "1rem" }}>
      <h1>Registrar Descuento</h1>
      {show && (
        <AlertDismissible onHide={() => setShow(false)} message={message} />
      )}
      <Form style={{ marginTop: "2rem" }}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="nombre"
            value={NewDescuento.nombre}
            as="textarea" rows={3} 
            placeholder="Ingrese descripción del descuento"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            name="cantidad"
            value={NewDescuento.cantidad}
            type="number"
            placeholder="Ingrese cantidad"
            onChange={handleChange}
          />
        </Form.Group>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            alignItems: "right",
            justifyContent: "right",
          }}
        >
          <Button
            style={{ backgroundColor: "#20bbcce1", borderColor: "#20bbcce1 " }}
            size="lg"
            onClick={handleSubmit}
            disabled={loadingDiscount}
          >
            {loadingDiscount ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Registrar"
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default FormDiscount;
