import { useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import Accordion from "react-bootstrap/Accordion";
import Moment from "moment";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import TableHistoryCitas from "./TableHistoryCitas";
import axios from "axios";

import ClipLoader from "react-spinners/ClipLoader";

export default function CardCitas({ citas, tipo, setKey, setCita }) {
  const [show, setShow] = useState(false);
  const [arrayHistorial, setArrayHistorial] = useState([]);

  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const handleHistorial = async (id, idMascota) => {
    console.log(id, idMascota);
    setLoadingHistorial(true);
    setShow(true);
    const resp = await axios.get(
      `${
        import.meta.env.VITE_SERVICE_CLIENT
      }/api/citas/history/${id}/Cliente/${idMascota}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(resp.data);
    setArrayHistorial(resp.data);
    setLoadingHistorial(false);
  };

  return (
    <>
      <Container>
        <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
          Citas Pendientes
        </h2>
        <div style={{ marginTop: "2rem" }}>
          {["September", "October", "November", "December"].map(
            (item, index) => (
              <Accordion key={index}>
                <Accordion.Item eventKey={index}>
                  <Accordion.Header>{item}</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      {citas
                        .filter((cita) => {
                          return Moment(cita.fecha).format("MMMM") === item;
                        })
                        .map((cita, index) => (
                          <Col key={index} sm={4}>
                            <Card style={{ marginTop: "1rem" }} border="light">
                              <Card.Body>
                                <Card.Title>
                                  {tipo === "Medico"
                                    ? cita.cliente
                                    : "Dr. " + cita.medico}
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                  {cita.mascota}
                                </Card.Subtitle>
                              </Card.Body>
                              <ListGroup variant="flush">
                                <ListGroup.Item>
                                  <b>Fecha:</b>{" "}
                                  {Moment(cita.fecha).format("DD/MM/YYYY")}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <b>Hora inicio:</b> {cita.inicio}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <b>Hora fin:</b> {cita.fin}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <b>Motivo:</b> {cita.motivo}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                  <b>Sala:</b> {cita.sala}
                                </ListGroup.Item>
                              </ListGroup>
                              {tipo === "Medico" && (
                                <>
                                  <Row
                                    style={{
                                      marginTop: "0.2rem",
                                      marginBottom: "0.2rem",
                                    }}
                                  >
                                    <Col>
                                      <Button
                                        style={{
                                          marginLeft: "10rem",
                                          marginRight: "-1rem",
                                          backgroundColor: "#20bbcce1",
                                          borderColor: "#20bbcce1 ",
                                        }}
                                        onClick={() => {
                                          setKey();
                                          setCita({
                                            idMotivo: cita.idMotivo,
                                            fecha: Moment(cita.fecha).format(
                                              "YYYY-MM-DD"
                                            ),
                                            inicio: cita.inicio,
                                            fin: cita.fin,
                                            mascota: cita.mascota,
                                            cliente: cita.cliente,
                                            raza: cita.raza,
                                          });
                                        }}
                                      >
                                        Atender
                                      </Button>
                                    </Col>
                                    <Col>
                                      <Button
                                        style={{
                                          backgroundColor: "#ff902f",
                                          borderColor: "#ff902f",
                                        }}
                                        onClick={() => {
                                          handleHistorial(
                                            cita.idCliente,
                                            cita.idMascota
                                          );
                                        }}
                                      >
                                        Ver Historial
                                      </Button>
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )
          )}
        </div>
      </Container>
      <ModalTable
        show={show}
        handleClose={() => setShow(false)}
        arrayHistorial={arrayHistorial}
        loadingHistorial={loadingHistorial}
      />
    </>
  );
}

function ModalTable({ arrayHistorial, show, handleClose, loadingHistorial }) {
  return (
    <Modal show={show} onHide={handleClose} fullscreen={true}>
      <Modal.Header closeButton>
        <Modal.Title>Historial de citas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingHistorial ? (
          <div style={{ textAlign: "center", marginTop: "15rem" }}>
            <ClipLoader
              color={"#C0CFFF"}
              loading={loadingHistorial}
              size={100}
            />
          </div>
        ) : (
          <TableHistoryCitas history={arrayHistorial} tipo={"Cliente"} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
