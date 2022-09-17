import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/esm/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Badge from "react-bootstrap/Badge";

export default function Payment() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    name: "",
    cardNumber: "",
    cvv: "",
    expiration: "",
  });
  const [validated, setValidated] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    if (form.checkValidity() === true) {
      setDisabled(true);
      axios
        .post(
          "http://localhost:5000/api/payment",
          {
            name: payment.name,
            cardNumber: payment.cardNumber,
            cvv: payment.cvv,
            expiration: payment.expiration,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          Swal.fire({
            title: "Payment Successful",
            text: "You will be redirected to the homepage",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/");
          });
        })
        .catch((err) => {
          handleToken();
        });
    }
    setValidated(true);
  };

  const handleInputChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const verificarToken = async () => {
    const resp = await axios
      .get(`${import.meta.env.VITE_SERVER_CLIENT}/api/payment/token`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        handleToken();
      });
    console.log(resp);
  };

  useEffect(() => {
    /*if (token) {
      verificarToken();
    }*/
  }, []);

  const handleToken = () => {
    Swal.fire({
      title: "Tiempo expirado",
      icon: "error",
      showDenyButton: true,
      confirmButtonText: "Generar nuevo token de pago",
      denyButtonText: `No generar y eliminar mi cita`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Token generado",
          icon: "success",
          text: "Se ha enviado un nuevo token a su correo",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          const respo = axios
            .get(
              `${import.meta.env.VITE_SERVER_CLIENT}/api/payment/new/token`,
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              setShowAlert(true);
            });
        });
      } else if (result.isDenied) {
        Swal.fire("Cita eliminada", "", "info");
      }
    });
    setDisabled(true);
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center">
        <div className="background_wavy_pay"></div>
      </Container>
      <Container
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card border="light" style={{ width: "50%" }}>
          <h1 style={{ textAlign: "center" }}>Pagar Cita</h1>
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Nombre"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    style={{ height: "50px" }}
                    name="name"
                    value={payment.name}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Ingrese su nombre"
                    disabled={disabled}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Numero de tarjeta"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    style={{ height: "50px" }}
                    name="cardNumber"
                    value={payment.cardNumber}
                    onChange={handleInputChange}
                    type="number"
                    maxLength="16"
                    placeholder="Ingrese su numero de tarjeta"
                    disabled={disabled}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="CVV"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    style={{ height: "50px" }}
                    name="cvv"
                    value={payment.cvv}
                    onChange={handleInputChange}
                    type="password"
                    placeholder="Ingrese su CVV"
                    disabled={disabled}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Fecha de expiracion"
                  className="mb-3"
                >
                  <Form.Control
                    style={{ height: "50px" }}
                    required
                    name="expiration"
                    value={payment.expiration}
                    onChange={handleInputChange}
                    type="month"
                    placeholder="Ingrese su fecha de expiracion"
                    disabled={disabled}
                  />
                </FloatingLabel>
              </Form.Group>
              <Button
                disabled={disabled}
                variant="primary"
                type="submit"
                style={{ width: "100%" }}
              >
                Pagar
              </Button>
              {showAlert && (
                <Badge
                  bg="danger"
                  size="lg"
                  style={{ marginLeft: "13rem", marginTop: "20px" }}
                >
                  Token nuevo enviado a su correo
                </Badge>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
