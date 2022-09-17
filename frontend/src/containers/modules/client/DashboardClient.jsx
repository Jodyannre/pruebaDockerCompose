import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import "../../../styles/admin.css";
import Form from "react-bootstrap/Form";

import { useContext } from "react";
import { AuthContext } from "../../../auth/context/AuthContext";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCitas,
  fetchHistoryCitas,
} from "../../../features/citas/citaSlice";
import { fetchMedicos } from "../../../features/users/usersSlice";
import { fetchMascotas } from "../../../features/mascotas/mascotaSlice";
import { fetchSalas } from "../../../features/salas/salaSlice";
import { fetchOcupados } from "../../../features/salas/ocupados";

import axios from "axios";

import CreateCita from "./cita/create/CreateCita";
import TableHistoryCitas from "../../../components/TableHistoryCitas";
import CardCitas from "../../../components/CardCitas";

import ClockLoader from "react-spinners/ClockLoader";
import ClipLoader from "react-spinners/ClipLoader";

export function DashboardClient() {
  const { citas, historyCitas, loadingHistorial, loadingPendientes } =
    useSelector((state) => state.citas);
  const { medicos } = useSelector((state) => state.users);
  const { mascotas } = useSelector((state) => state.mascotas);
  const { salas, ocupados } = useSelector((state) => state.salas);

  const { user } = useContext(AuthContext);

  const dispatch = useDispatch();

  const [manage_mascotas, setManageMascotas] = useState(false);
  const [manage_citas, setManageCitas] = useState(false);

  const [tab_key, setTab_key] = useState("cero");

  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await axios.post(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/pet/uploadImage/${
        user.id_usuario
      }/mascota`,
      formData,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  useEffect(() => {
    dispatch(fetchCitas(user.id_usuario, "Cliente"));
    dispatch(fetchHistoryCitas(user.id_usuario, "Cliente"));
    dispatch(fetchMedicos());
    dispatch(fetchMascotas(user.id_usuario));
    dispatch(fetchSalas());
    dispatch(fetchOcupados());
  }, []);

  return (
    <>
      <Header action="Cerrar Sesion" link="/" color="#ECFFEC" />
      <div style={{ marginRight: "2rem" }}>
        <Tab.Container
          bg="dark"
          variant="dark"
          id="left-tabs-example"
          activeKey={tab_key}
        >
          <Row>
            <Col sm={3}>
              <div className="Bar" style={{ backgroundColor: "#ECFFEC" }}>
                <Nav
                  variant="pills"
                  className="flex-column"
                  style={{ marginLeft: "5px" }}
                >
                  <Nav.Item style={{ marginTop: "10px" }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (
                          tab_key === "first" ||
                          (tab_key === "first-2" && manage_mascotas)
                        ) {
                          setTab_key("five");
                        }
                        setManageMascotas(!manage_mascotas);
                      }}
                    >
                      🐶 Mascotas{" "}
                      {manage_mascotas ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_mascotas ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="first"
                          onClick={() => setTab_key("first")}
                        >
                          🧸 Mis Mascotas
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="first-2"
                          onClick={() => setTab_key("first-2")}
                        >
                          🐾
                        </Nav.Link>{" "}
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  <Nav.Item style={{ marginTop: "10px" }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (
                          (tab_key === "second" ||
                            tab_key === "second-2" ||
                            tab_key === "second-3") &&
                          manage_citas
                        ) {
                          setTab_key("five");
                        }
                        setManageCitas(!manage_citas);
                      }}
                    >
                      🖊 Citas{" "}
                      {manage_citas ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_citas ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="second"
                          onClick={() => setTab_key("second")}
                        >
                          🐕‍🦺 Agendar Cita
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="second-2"
                          onClick={() => setTab_key("second-2")}
                        >
                          🗃 Historial Citas
                        </Nav.Link>{" "}
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="second-3"
                          onClick={() => setTab_key("second-3")}
                        >
                          🗓 Citas Pendientes
                        </Nav.Link>
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                </Nav>
              </div>
            </Col>
            <Col sm={9}>
              <Tab.Content style={{ marginLeft: "-4rem" }}>
                <Tab.Pane eventKey="cero">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "18rem",
                    }}
                  >
                    <h1>Bienvenido 👋</h1>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="first">
                  <Form.Group
                    controlId="formFile"
                    className="mb-3"
                    style={{ marginTop: "1rem", marginLeft: "1rem" }}
                  >
                    <Form.Label>Actualizar foto mascota</Form.Label>
                    <Form.Control onChange={upload} type="file" size="sm" />
                  </Form.Group>
                </Tab.Pane>
                <Tab.Pane eventKey="first-2"></Tab.Pane>
                <Tab.Pane eventKey="second">
                  <CreateCita
                    mascotas={mascotas}
                    medicos={medicos}
                    salas={salas}
                    ocupados={ocupados}
                    id={user.id_usuario}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="second-2">
                  {loadingHistorial ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "12rem",
                      }}
                    >
                      <ClockLoader
                        color={"#C4FFC4"}
                        loading={true}
                        size={200}
                        speedMultiplier={0.5}
                      />
                    </div>
                  ) : (
                    <TableHistoryCitas
                      history={historyCitas}
                      tipo={"Cliente"}
                    />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="second-3">
                  {loadingPendientes ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "12rem",
                      }}
                    >
                      <ClipLoader
                        color={"#C4FFC4"}
                        loading={true}
                        size={200}
                        speedMultiplier={0.5}
                      />
                    </div>
                  ) : (
                    <CardCitas citas={citas} tipo={"Cliente"} />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="five">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "18rem",
                    }}
                  >
                    <h1>👈 Seleccione una opcion</h1>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}
