import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import "../../../styles/admin.css";
import Form from "react-bootstrap/Form";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  fetchCitas,
  fetchHistoryCitas,
} from "../../../features/citas/citaSlice";
import { fetchMedicamentos } from "../../../features/medicamentos/medicamentosSlice";
import { useContext } from "react";
import { AuthContext } from "../../../auth/context/AuthContext";
import CardCitas from "../../../components/CardCitas";
import FormActual from "./cita/actual/FormActual";
import TableHistoryCitas from "../../../components/TableHistoryCitas";

import ClockLoader from "react-spinners/ClockLoader";
import ClipLoader from "react-spinners/ClipLoader";

export function DashboardMedico() {
  const { citas, historyCitas, loadingHistorial, loadingPendientes } =
    useSelector((state) => state.citas);
  const { medicamentos } = useSelector((state) => state.medicamentos);

  const [citaActual, setCitaActual] = useState({});

  const [manage_citas, setManageCitas] = useState(false);
  const [tab_key, setTab_key] = useState("cero");
  const { user, logout } = useContext(AuthContext);

  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await axios.post(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/pet/uploadImage/1`,
      formData,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    ).catch((err) => {
      console.log(err);
    });
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCitas(user.id_usuario, "Medico"));
    dispatch(fetchMedicamentos());
    dispatch(fetchHistoryCitas(user.id_usuario, "Medico"));
  }, []);

  return (
    <>
      <Header action="Cerrar Sesion" link="/" color="#EEF2FF" />
      <div style={{ marginRight: "2rem" }}>
        <Tab.Container
          bg="dark"
          variant="dark"
          id="left-tabs-example"
          activeKey={tab_key}
        >
          <Row>
            <Col sm={3}>
              <div className="Bar" style={{ backgroundColor: "#EEF2FF" }}>
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
                          (tab_key === "first-2" && manage_citas)
                        ) {
                          setTab_key("five");
                        }
                        setManageCitas(!manage_citas);
                      }}
                    >
                      🩺 Citas{" "}
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
                          eventKey="first"
                          onClick={() => setTab_key("first")}
                        >
                          💉 Cita Actual
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="first-3"
                          onClick={() => setTab_key("first-3")}
                        >
                          🗓 Citas Pendientes
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: "20px", fontSize: 20 }}
                          eventKey="first-2"
                          onClick={() => setTab_key("first-2")}
                        >
                          🗃 Historial de Citas
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
                  <FormActual
                    cita={citaActual}
                    medicamentos={medicamentos}
                    setCita={() => {
                      setCitaActual({
                        idMotivo: "",
                        fecha: "",
                        inicio: "",
                        fin: "",
                        mascota: "",
                        cliente: "",
                        raza: "",
                      });
                    }}
                    id={user.id_usuario}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="first-2">
                  {loadingHistorial ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "12rem",
                      }}
                    >
                      <ClockLoader color={"#C0CFFF"} loading={true} size={200}  speedMultiplier={0.5}/>
                    </div>
                  ) : (
                    <TableHistoryCitas history={historyCitas} tipo={"Medico"} id={user.id_usuario}/>
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
                <Tab.Pane eventKey="first-3">
                  {loadingPendientes ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "12rem",
                      }}
                    >
                      <ClipLoader color={"#C0CFFF"} loading={true} size={200} speedMultiplier={0.5} />
                    </div>
                  ) : (
                    <CardCitas
                      citas={citas}
                      tipo={"Medico"}
                      setKey={() => setTab_key("first")}
                      setCita={setCitaActual}
                    />
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}
