import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import AlertDismissible from "../../../../../components/Alert";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import AddMotivo from "./AddMotivo";
import Spinner from "react-bootstrap/Spinner";
import Moment from "moment";

import { createCita } from "../../../../../features/citas/citaSlice";

function CreateCita({ mascotas, medicos, salas, ocupados, id }) {
  const {loadingCita} = useSelector((state) => state.citas);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [addM, setAddM] = useState(false);

  const [listaMotivos, setMotivos] = useState([]);
  const [ocupadosF, setOcupados] = useState([]);

  const [mascota, setMascota] = useState("0");
  const [fecha, setFecha] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fecha === "" || mascota === "0") {
      setShow(true);
      setMessage("Todos los campos son obligatorios");
      setTimeout(() => {
        setShow(false);
      }, 5000);
      return;
    }
    console.log(fecha);

    setOcupados(
      ocupados.filter((o) => {
        return Moment(o.fecha).format("YYYY-MM-DD") === fecha;
      })
    );
    setShowButton(false);
  };

  const handleCita = (e) => {
    e.preventDefault();
    var cita = {
      fecha: Moment(fecha).format("DD-MM-YYYY"),
      idMascota: mascota,
      motivos: listaMotivos,
      tipo: 1,
    };
    console.log(cita);
    dispatch(createCita(cita, id, "Cliente"));
  };

  useEffect(() => {
    if(loadingCita === false){
      setMotivos([]);
      setShowButton(true);
      setMascota("0");
      setFecha("");
    }
  }, [loadingCita]);


  return (
    <Container>
      <h1>Crear Cita</h1>
      {show && (
        <AlertDismissible onHide={() => setShow(false)} message={message} />
      )}
      <Form style={{ marginTop: "1rem" }}>
        <Form.Group className="mb-3">
          <Form.Label>Mascota: </Form.Label>
          <Form.Select
            disabled={showButton === false}
            aria-label="Default select example"
            onChange={(e) => setMascota(e.target.value)}
            size="sm"
          >
            <option>Seleccionar Mascota</option>
            {mascotas.map((mascota) => (
              <option value={mascota.id}>{mascota.nombre}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha: </Form.Label>
          <Form.Control
            disabled={showButton === false}
            type="date"
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setFecha(e.target.value)}
            size="sm"
          />
        </Form.Group>
        {showButton ? (
          <Button
            style={{ backgroundColor: "#20bbcce1", borderColor: "#20bbcce1 " }}
            size="lg"
            onClick={handleSubmit}
          >
            Agendar Cita
          </Button>
        ) : !addM ? (
          <div
            style={{
              marginTop: "11rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Row>
              <Col>
                <Button
                  style={{
                    backgroundColor: "#20bbcce1",
                    borderColor: "#20bbcce1 ",
                    width: "12rem",
                  }}
                  disabled={loadingCita}
                  size="lg"
                  onClick={() => setAddM(true)}
                >
                  Agregar Motivo
                </Button>
              </Col>
              <Col>
                <Button
                  style={{
                    backgroundColor: "#ff902f",
                    borderColor: "#ff902f",
                  }}
                  disabled={loadingCita}
                  size="lg"
                  onClick={() => {
                    setMotivos([]);
                    setShowButton(true);
                  }}
                >
                  Cancelar
                </Button>
              </Col>
              {listaMotivos.length > 0 && (
                <Col>
                  <Button
                    style={{
                      backgroundColor: "#20bbcce1",
                      borderColor: "#20bbcce1 ",
                      width: "12rem",
                    }}
                    disabled={loadingCita}
                    size="lg"
                    onClick={handleCita}
                  >
                   {
                      loadingCita ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="lg"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        "Crear Cita ✅"
                      )
                   }
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <></>
        )}
        {addM && (
          <AddMotivo
            listaMotivos={listaMotivos}
            medicos={medicos}
            salas={salas}
            ocupados={ocupadosF}
            onHide={() => setAddM(false)}
          />
        )}
      </Form>
    </Container>
  );
}

export default CreateCita;
