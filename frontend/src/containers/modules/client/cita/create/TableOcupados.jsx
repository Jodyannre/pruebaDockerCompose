import Table from "react-bootstrap/esm/Table";
import Badge from "react-bootstrap/Badge";

function TablaOcupados({ ocupados }) {

  const style = {
    top: 0,
    left: 0,
    zIndex: 10,
    height: "2.5rem",
    position: "sticky",
    color: "#000",
    backgroundColor: "#fff",
  };

  return (
    <div  style={{
        marginTop: "5px",
        overflowY: "auto",
        height: "18rem",
      }}>
      <Table striped bordered hover size="sm" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>#</th>
            <th style={style}> Hora incial</th>
            <th style={style}> Hora final</th>
            <th style={style}> Medico </th>
            <th style={style}> Sala </th>
            <th style={style}></th>
          </tr>
        </thead>
        <tbody>
          {ocupados.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.inicio}</td>
              <td>{item.tipo_cita === "Normal" ? item.fin : ""}</td>
              <td>{item.medico}</td>
              <td>{item.sala}</td>
              <td>
                {item.tipo_cita === "Normal" ? (
                  <Badge bg="warning">Ocupado</Badge>
                ) : (
                  <Badge bg="danger">Ocupado por emergencia</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TablaOcupados;
