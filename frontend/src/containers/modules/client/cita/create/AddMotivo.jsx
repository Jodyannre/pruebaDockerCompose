import { useState, useEffect } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Moment from "moment";
import TablaOcupados from "./TableOcupados";

const hora1 = [
  "8:00:00",
  "9:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
];

const hora2 = [
  "16:00:00",
  "17:00:00",
  "18:00:00",
  "19:00:00",
  "20:00:00",
  "21:00:00",
  "22:00:00",
  "23:00:00",
];

const hora3 = [
  "0:00:00",
  "1:00:00",
  "2:00:00",
  "3:00:00",
  "4:00:00",
  "5:00:00",
  "6:00:00",
  "7:00:00",
];

function AddMotivo({ listaMotivos, onHide, ocupados, salas, medicos }) {
  const [filtrar, setFiltrar] = useState(false);

  const [ocupadosFiltrados, setOcupadosFiltrados] = useState([]);

  const [horas, setHoras] = useState([]);
  const [medicosF, setMedicos] = useState([]);
  const [salasF, setSalas] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [motivo, setMotivo] = useState("");
  const [sala, setSala] = useState("0");
  const [medico, setMedico] = useState("0");
  const [hora, setHora] = useState("0");

  const handleFiltrar = (e) => {
    console.log(medicos);
    console.log(salas);
    e.preventDefault();
    if (e.target.value === "0") {
      setFiltrar(false);
      return;
    }
    setMotivo(e.target.value);
    console.log(e.target.value);
    var temp = ocupados.filter((o) => {
      return o.id_especialidad === parseInt(e.target.value);
    });
    setOcupadosFiltrados(temp);
    setMedicos(
      medicos.filter((medico) => {
        return medico.especialidad === parseInt(e.target.value);
      })
    );
    setFiltrar(true);
  };

  const handleMedico = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setMedico(e.target.value);
    var temp = ocupadosFiltrados.filter((o) => {
      return o.id_medico === parseInt(e.target.value);
    });

    var horaLaboral = medicos.filter((medico) => {
      return medico.id === parseInt(e.target.value);
    });

    console.log(horaLaboral[0]);

    let horas = [];

    if (horaLaboral[0].horario === "1") {
      horas = hora1;
    } else if (horaLaboral[0].horario === "2") {
      horas = hora2;
    } else if (horaLaboral[0].horario === "3") {
      horas = hora3;
    }

    setHoras(
      hora1.filter((hora) => {
        return !temp.some((t) => {
          return t.inicio === hora;
        });
      })
    );

    setShow(true);
  };

  const handleTime = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setHora(e.target.value);
    setShow2(true);
    var temp = ocupadosFiltrados.filter((o) => {
      return o.inicio === e.target.value;
    });
    setSalas(
      salas.filter((sala) => {
        return !temp.some((t) => {
          return t.id_sala === sala.id;
        });
      })
    );
  };

  const handleSala = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setSala(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    listaMotivos.push({
      idMotivo: motivo,
      idMedico: medico,
      idSala: sala,
      inicio: hora,
    });
    setFiltrar(false);
    onHide();
    setShow(false);
    setShow2(false);
  };

  return (
    <Container style={{ marginTop: "1rem" }}>
      {!filtrar ? (
        <Form>
          <h4>Agregar motivo a la cita: </h4>
          <Form.Group className="mb-3">
            <Form.Select name="motivo" onChange={handleFiltrar} size="md">
              <option value="0">Seleccione un motivo</option>
              <option value="1">Medicina General</option>
              <option value="2">Traumatologia</option>
              <option value="3">Oftalmología</option>
              <option value="4">Ginecologia</option>
              <option value="5">Análisis de laboratorio</option>
            </Form.Select>
          </Form.Group>
        </Form>
      ) : (
        <>
          <h5 style={{ marginTop: "1rem" }}>
            Motivo seleccionado:{" "}
            {motivo === "1"
              ? "Medicina General"
              : motivo === "2"
              ? "Traumatologia"
              : motivo === "3"
              ? "Oftalmología"
              : motivo === "4"
              ? "Ginecologia"
              : motivo === "5"
              ? "Análisis de laboratorio"
              : ""}
          </h5>
          <TablaOcupados ocupados={ocupadosFiltrados} />
          <Form style={{ marginTop: "1rem" }}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Select name="medico" size="sm" onChange={handleMedico}>
                    <option value="0">Seleccione un medico</option>
                    {medicosF.map((m, index) => (
                      <option key={index} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              {show && (
                <>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Select name="hora" size="sm" onChange={handleTime}>
                        <option value="0">Seleccione una hora</option>
                        {horas.map((h, index) => (
                          <option key={index} value={h}>
                            {h}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </>
              )}
              {show2 && (
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select name="sala" size="sm" onChange={handleSala}>
                      <option value="0">Seleccione una sala</option>
                      {salasF.map((s, index) => (
                        <option key={index} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Form>
          <div
            style={{
              display: "flex",
              alignItems: "right",
              justifyContent: "right",
            }}
          >
            <Button
              style={{
                backgroundColor: "#20bbcce1",
                borderColor: "#20bbcce1 ",
                marginRight: "5px",
              }}
              onClick={handleSubmit}
            >
              Registar motivo
            </Button>

            <Button
              style={{
                backgroundColor: "#ff902f",
                borderColor: "#ff902f",
              }}
              onClick={() => {
                setFiltrar(false);
                onHide();
                setShow(false);
                setShow2(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default AddMotivo;
