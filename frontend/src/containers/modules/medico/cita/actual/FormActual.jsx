import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReceta } from "../../../../../features/citas/receta";
import { updateCita } from "../../../../../features/citas/citaSlice";
import Container from "react-bootstrap/esm/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

export default function FormActual({ cita, medicamentos, setCita, id }) {
  const { loadingCita } = useSelector((state) => state.citas);
  const [receta, setReceta] = useState({
    descripcion: "",
    medicamentos: [],
  });

  const [listaMedicamentos, setListaMedicamentos] = useState([]);

  const handleChange = (e) => {
    setReceta({
      ...receta,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setListaMedicamentos(medicamentos);
  }, [medicamentos]);

  useEffect(() => {
    if (loadingCita === false) {
      setReceta({
        medicamentos: [],
        descripcion: "",
      });
      setCita();
    }
  }, [loadingCita]);

  const dispatch = useDispatch();

  const handleSubmmit = (e) => {
    e.preventDefault();
    console.log({
      ...receta,
      idMotivo: cita.idMotivo,
    });
    dispatch(
      createReceta({
        ...receta,
        idMotivo: cita.idMotivo,
      })
    );
    dispatch(updateCita(id, cita.idMotivo));
  };

  return (
    <>
      <Container>
        <h2 style={{ textAlign: "center", marginTop: "1rem" }}>Cita Actual</h2>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={cita.fecha} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Hora inicio</Form.Label>
                <Form.Control type="time" value={cita.inicio} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Hora fin</Form.Label>
                <Form.Control type="time" value={cita.fin} disabled />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mascota</Form.Label>
                <Form.Control type="text" value={cita.mascota} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Raza</Form.Label>
                <Form.Control type="text" value={cita.raza} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Cliente</Form.Label>
                <Form.Control type="text" value={cita.cliente} disabled />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group style={{ marginTop: "0rem" }} className="mb-3">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              name="descripcion"
              value={receta.descripcion}
              as="textarea"
              rows={2}
              placeholder="Ingrese descripción de la receta"
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
        <h4 style={{ textAlign: "center", marginTop: "1rem" }}>Medicamentos</h4>
        <Form>
          <Form.Control
            name="search"
            size="sm"
            type="search"
            placeholder="Buscar medicamento"
            aria-label="Search"
            onChange={(e) => {
              setListaMedicamentos(
                medicamentos.filter((medicamento) =>
                  medicamento.nombre
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
            style={{ borderColor: "#ff902f" }}
          />
        </Form>
        <div
          style={{
            marginTop: "1rem",
            overflowY: "auto",
            height: "12rem",
          }}
        >
          <ListGroup>
            {listaMedicamentos.map((medicamento) => (
              <ListGroup.Item
                disabled={cita.inicio === ""}
                active={receta.medicamentos.includes(medicamento.id)}
                key={medicamento.id}
                action
                onClick={() => {
                  setReceta({
                    ...receta,
                    medicamentos: receta.medicamentos.includes(medicamento.id)
                      ? receta.medicamentos.filter(
                          (id) => id !== medicamento.id
                        )
                      : [...receta.medicamentos, medicamento.id],
                  });
                }}
              >
                {medicamento.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "right",
            justifyContent: "right",
            marginTop: "1.5rem",
          }}
        >
          {cita.inicio !== "" ? (
            <>
              <Button
                style={{
                  backgroundColor: "#20bbcce1",
                  borderColor: "#20bbcce1 ",
                  marginRight: "5px",
                }}
                disabled={loadingCita}
                onClick={handleSubmmit}
              >
                {loadingCita ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Terminar Cita"
                )}
              </Button>
              <Button
                style={{
                  backgroundColor: "#ff902f",
                  borderColor: "#ff902f",
                }}
                onClick={() => {
                  setReceta({
                    medicamentos: [],
                    descripcion: "",
                  });
                  setCita();
                }}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <h4>
              <strong style={{color:"#ff902f" }}>Seleccione una cita</strong>
            </h4>
          )}
        </div>
      </Container>
    </>
  );
}
