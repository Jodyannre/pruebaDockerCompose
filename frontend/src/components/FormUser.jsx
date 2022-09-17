import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import AlertDismissible from "./Alert";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { createUser, setError } from "../features/users/usersSlice";

function FormUser({ tipo }) {
  const [NewUser, setNewUser] = useState({
    nombre: "",
    usuario: "",
    correo: "",
    edad: "",
    direccion: "",
    telefono: "",
    password: "",
    password2: "",
    horario: "0",
    especialidad: "0",
    tipo: tipo === "medico" ? 2 : tipo === "secretaria" ? 3 : 4,
  });
  const { loading } = useSelector((state) => state.users);
  const { error } = useSelector((state) => state.users);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setNewUser({
      ...NewUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      NewUser.nombre === "" ||
      NewUser.usuario === "" ||
      NewUser.correo === "" ||
      NewUser.edad === "" ||
      NewUser.direccion === "" ||
      NewUser.telefono === "" ||
      NewUser.password === "" ||
      NewUser.password2 === ""
    ) {
      setShow(true);
      setMessage("Todos los campos son obligatorios");
      setTimeout(() => {
        setShow(false);
      }, 5000);
      return;
    } else if (
      tipo === "medico" &&
      (NewUser.especialidad === "" || NewUser.especialidad === "0")
    ) {
      setShow(true);
      setMessage("El campo especialidad es obligatorio");
      setTimeout(() => {
        setShow(false);
      }, 5000);
      return;
    } else if (tipo === "medico" || tipo === "secretaria") {
      if (NewUser.horario === "" || NewUser.horario === "0") {
        setShow(true);
        setMessage("El campo horario es obligatorio");
        setTimeout(() => {
          setShow(false);
        }, 5000);
        return;
      }
    } else if (NewUser.password !== NewUser.password2) {
      setShow(true);
      setMessage("Las contraseñas no coinciden");
      setTimeout(() => {
        setShow(false);
      }, 5000);
      return;
    }
    setSubmit(true);
    dispatch(createUser(NewUser));
  };

  useEffect(() => {
    if (loading === false && submit === true) {
      if (error) {
        setError(false);
        return;
      }
      setNewUser({
        ...NewUser,
        nombre: "",
        correo: "",
        edad: "",
        usuario: "",
        direccion: "",
        telefono: "",
        password: "",
        password2: "",
        especialidad: "0",
      });
      setSubmit(false);
    }
  }, [loading]);

  return (
    <Container style={{ marginTop: "1rem" }}>
      <h1>Registrar {tipo}</h1>
      {show && (
        <AlertDismissible onHide={() => setShow(false)} message={message} />
      )}
      <Form style={{ marginTop: "2rem" }}>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={NewUser.nombre}
                type="text"
                placeholder="Ingrese su nombre"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                name="usuario"
                value={NewUser.usuario}
                type="text"
                placeholder="Ingrese su usuario"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                name="correo"
                value={NewUser.correo}
                type="email"
                placeholder="Ingrese su correo"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                name="edad"
                value={NewUser.edad}
                type="number"
                placeholder="Ingrese su edad"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Direccion</Form.Label>
              <Form.Control
                name="direccion"
                value={NewUser.direccion}
                type="text"
                placeholder="Ingrese su direccion"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                name="telefono"
                value={NewUser.telefono}
                type="number"
                placeholder="Ingrese su telefono"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group
              className="mb-3"
              controlId="formBasicPassword"
              onChange={handleChange}
            >
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                name="password"
                value={NewUser.password}
                type="password"
                placeholder="Ingrese su contraseña"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              className="mb-3"
              controlId="formBasicPassword"
              onChange={handleChange}
            >
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                name="password2"
                value={NewUser.password2}
                type="password"
                placeholder="Ingrese su contraseña"
              />
            </Form.Group>
          </Col>
        </Row>
        {tipo === "medico" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Especialidad</Form.Label>
              <Form.Select
                name="especialidad"
                value={NewUser.especialidad}
                onChange={handleChange}
              >
                <option value="0">Seleccione una especialidad</option>
                <option value="1">Medicina General</option>
                <option value="2">Traumatologia</option>
                <option value="3">Oftalmología</option>
                <option value="4">Ginecologia</option>
                <option value="5">Análisis de laboratorio</option>
              </Form.Select>
            </Form.Group>
          </>
        )}
        {(tipo === "medico" || tipo === "secretaria") && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Horario Laboral</Form.Label>
              <Form.Select
                name="horario"
                value={NewUser.horario}
                onChange={handleChange}
              >
                <option value="0">Seleccione un horario</option>
                <option value="1">8am - 4pm</option>
                <option value="2">4pm - 12am</option>
                <option value="3">12am - 8am</option>
              </Form.Select>
            </Form.Group>
          </>
        )}
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
            disabled={loading}
          >
            {loading ? (
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

export default FormUser;
