import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/Modal";
import Moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import FileViewer from "react-file-viewer";
import { createStudie } from "../features/citas/estudio";
import Spinner from "react-bootstrap/esm/Spinner";

export default function TableHistoryCitas({ history, tipo, id }) {
  const { loadingCita } = useSelector((state) => state.citas);

  const [loadingReceta, setLoadingReceta] = useState(false);
  const [loadingEstudio, setLoadingEstudio] = useState(false);

  const [show, setShow] = useState(false);
  const [showEstudio, setShowEstudio] = useState(false);
  const [showView, setShowView] = useState(false);

  const [receta, setReceta] = useState({
    receta: { descripcion: "" },
    medicamentos: [],
  });

  const [estudio, setEstudio] = useState({
    idMotivo: "",
    nombre: "",
    direccion: "",
  });

  const style = {
    top: 0,
    left: 0,
    zIndex: 10,
    height: "2.5rem",
    position: "sticky",
    color: "#000",
    backgroundColor: "#fff",
  };

  const dispatch = useDispatch();

  const handleSubmit = () => {
    console.log(estudio);
    dispatch(createStudie(estudio, id));
  };

  useEffect(() => {
    if (loadingCita === false) {
      setEstudio({
        nombre: "",
        dirreccion: "",
      });
      setShowEstudio(false);
    }
  }, [loadingCita]);

  const handleReceta = async (id) => {
    setLoadingReceta(true);
    const resp = await axios.get(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/citas/m/receta/${id}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    console.log(resp.data);
    setLoadingReceta(false);
    if (resp.data.medicamentos !== null) {
      setReceta(resp.data);
      setShow(true);
      return;
    }
    Swal.fire({
      title: "No hay receta",
      icon: "warning",
    });
  };

  const hanldeEstudio = async (id) => {
    setLoadingEstudio(true);
    const resp = await axios.get(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/citas/m/estudio/${id}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    setLoadingEstudio(false);
    if (resp.data === null && tipo === "Medico") {
      setShowEstudio(true);
      setEstudio({
        ...estudio,
        idMotivo: id,
      });
      return;
    }
    if (resp.data !== null) {
      setEstudio(resp.data);
      setShowView(true);
      return;
    }
    if (resp.data === null) {
      Swal.fire({
        title: "No hay estudio",
        icon: "warning",
      });
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
        Historial de Citas
      </h1>
      <div
        style={{
          marginTop: "1rem",
          overflowY: "auto",
          height: "calc(85vh - 100px)",
        }}
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={style}>#</th>
              <th style={style}>Fecha</th>
              <th style={style}>Mascota</th>
              <th style={style}>{tipo === "Cliente" ? "Medico" : "Cliente"}</th>
              <th style={style}>Sala</th>
              <th style={style}>Motivo</th>
              <th style={style}>Receta</th>
              <th style={style}>Estudio</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{index + 1} </td>
                <td>{Moment(item.fecha).format("DD/MM/YYYY")}</td>
                <td>{item.mascota}</td>
                <td>{tipo === "Cliente" ? item.medico : item.cliente}</td>
                <td>{item.sala}</td>
                <td>{item.motivo}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => handleReceta(item.idMotivo)}
                    style={{
                      backgroundColor: "#20bbcce1",
                      borderColor: "#20bbcce1 ",
                    }}
                  >
                    {loadingReceta ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Ver"
                    )}
                  </Button>
                </td>
                <td>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: "#ff902f",
                      borderColor: "#ff902f",
                    }}
                    onClick={() => {
                      hanldeEstudio(item.idMotivo);
                    }}
                  >
                    {loadingEstudio ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "Abrir"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ModalReceta show={show} onHide={() => setShow(false)} receta={receta} />
      <ModalEstudio
        show={showEstudio}
        onHide={() => setShowEstudio(false)}
        setEstudio={setEstudio}
        estudio={estudio}
        handleSubmit={handleSubmit}
      />
      <ModalView
        show={showView}
        onHide={() => {
          setShowView(false);
          setEstudio({
            nombre: "",
            dirreccion: "",
          });
        }}
        file={estudio}
      />
    </>
  );
}

function ModalReceta({ show, onHide, receta }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Receta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Descripción</h4>
        <p>{receta.receta.descripcion}</p>
        <h4>Medicamentos</h4>
        <ul>
          {receta.medicamentos.map((item, index) => (
            <li key={index}>{item.medicamento}</li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
}

function ModalEstudio({ show, onHide, setEstudio, estudio, handleSubmit }) {
  const upload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVICE_CLIENT}/api/pet/uploadImage/${
          estudio.idMotivo
        }/exp`,
        formData,
        {
          headers: {
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setEstudio({
        ...estudio,
        direccion: `${estudio.idMotivo}-${e.target.files[0].name}`,
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ocurrio un error al subir el archivo",
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Estudio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={estudio.nombre}
              onChange={(e) =>
                setEstudio({ ...estudio, nombre: e.target.value })
              }
              size="sm"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="file"
              size="sm"
              accept=".pdf, .jpg, .png, .jpeg , .docx, .doc, .xlsx, .xls, .pptx, .ppt"
              onChange={upload}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "#20bbcce1",
            borderColor: "#20bbcce1 ",
          }}
          variant="primary"
          onClick={handleSubmit}
        >
          Guardar
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setEstudio({
              nombre: "",
              dirreccion: "",
            });
            onHide();
          }}
          style={{
            backgroundColor: "#ff902f",
            borderColor: "#ff902f",
          }}
        >
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ModalView({ file, show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nombre Estudio: {file.direccion}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 style={{ textAlign: "center" }}>
          Descargar:{" "}
          <a
            href={`${import.meta.env.VITE_SERVICE_CLIENT}/static/${
              file.nombre
            }`}
          >
            Link
          </a>
        </h3>
        <div style={{ height: "34rem" }}>
          <FileViewer
            fileType={file.nombre.split(".")[1]}
            filePath={`${import.meta.env.VITE_SERVICE_CLIENT}/static/${
              file.nombre
            }`}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}
