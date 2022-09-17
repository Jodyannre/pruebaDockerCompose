import { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import '../../../styles/admin.css'
import Form from 'react-bootstrap/Form'

import axios from 'axios'
import FormUser from '../../../components/FormUser'

export function DashboardSecretaria() {
  const [manage_mascotas, setManageMascotas] = useState(false)
  const [manage_clientes, setManageClientes] = useState(false)
  const [manage_citas, setManageCitas] = useState(false)
  const [tab_key, setTab_key] = useState('cero')

  const upload = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const res = await axios.post(
      `${import.meta.env.VITE_SERVICE_CLIENT}/api/pet/uploadImage/1`,
      formData,
      {}
    )
  }

  return (
    <>
      <Header action="Cerrar Sesion" link="/" color="#FEEEFF" />
      <div style={{ marginRight: '2rem' }}>
        <Tab.Container bg="dark" variant="dark" id="left-tabs-example" activeKey={tab_key}>
          <Row>
            <Col sm={3}>
              <div className="Bar" style={{ backgroundColor: '#FEEEFF' }}>
                <Nav variant="pills" className="flex-column" style={{ marginLeft: '5px' }}>
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (tab_key === 'first' || (tab_key === 'first-2' && manage_clientes)) {
                          setTab_key('five')
                        }
                        setManageClientes(!manage_clientes)
                      }}
                    >
                      👨 Clientes{' '}
                      {manage_clientes ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_clientes ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="first"
                          onClick={() => setTab_key('first')}
                        >
                          👩‍🦲 Crear Cliente
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="first-2"
                          onClick={() => setTab_key('first-2')}
                        >
                          📃 Listar Clientes
                        </Nav.Link>
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (tab_key === 'second' || (tab_key === 'second-2' && manage_mascotas)) {
                          setTab_key('five')
                        }
                        setManageMascotas(!manage_mascotas)
                      }}
                    >
                      🐶 Pacientes{' '}
                      {manage_mascotas ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_mascotas ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="second"
                          onClick={() => setTab_key('second')}
                        >
                          🧸 Crear Mascotas
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="second-2"
                          onClick={() => setTab_key('second-2')}
                        >
                          🐾 Ver Mascotas
                        </Nav.Link>{' '}
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (
                          tab_key === 'third' ||
                          (tab_key === 'third-2' && manage_citas) ||
                          (tab_key === 'third-3' && manage_citas)
                        ) {
                          setTab_key('five')
                        }
                        setManageCitas(!manage_citas)
                      }}
                    >
                      📁 Citas{' '}
                      {manage_citas ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_citas ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="third"
                          onClick={() => setTab_key('third')}
                        >
                          📆 Crear Citas
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="third-2"
                          onClick={() => setTab_key('third-2')}
                        >
                          📒 Ver Citas
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="third-3"
                          onClick={() => setTab_key('third-3')}
                        >
                          🏢 Ver Salas
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
              <Tab.Content style={{ marginLeft: '-4rem' }}>
                <Tab.Pane eventKey="cero">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '18rem',
                    }}
                  >
                    <h1>Bienvenido 👋</h1>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="first">
                  <Form.Group
                    controlId="formFile"
                    className="mb-3"
                    style={{ marginTop: '1rem', marginLeft: '1rem' }}
                  >
                    <Form.Label>Actualizar foto mascota</Form.Label>
                    <Form.Control onChange={upload} type="file" size="sm" />
                  </Form.Group>
                </Tab.Pane>
                <Tab.Pane eventKey="first-2"></Tab.Pane>
                <Tab.Pane eventKey="five">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '18rem',
                    }}
                  >
                    <h1>👈 Seleccione una opcion</h1>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="second">
                  <FormUser tipo="mascota" />
                  {/* <Form.Group
                    controlId="formFile"
                    className="mb-3"
                    style={{ marginTop: '1rem', marginLeft: '1rem' }}
                  >
                    <Form.Label>Actualizar foto mascota</Form.Label>
                    <Form.Control onChange={upload} type="file" size="sm" />
                  </Form.Group> */}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  )
}
