import { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Tab from 'react-bootstrap/Tab'
import '../../../styles/admin.css'
import FormUser from '../../../components/FormUser'
import TableUser from '../../../components/TableUser'
import FormDiscount from '../../../components/FormDiscount'
import TableDiscount from '../../../components/TableDiscount'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchMedicos,
  fetchPacientes,
  fetchSecretarias,
  fetchAspirantes,
} from '../../../features/users/usersSlice'
import { fetchDiscounts } from '../../../features/discounts/discountSlice'

export function Admin() {
  const { medicos } = useSelector((state) => state.users)
  const { pacientes } = useSelector((state) => state.users)
  const { secretarias } = useSelector((state) => state.users)
  const { aspirantes } = useSelector((state) => state.users)
  const { discounts } = useSelector((state) => state.discounts)

  const [manage_medicos, setManage_medicos] = useState(false)
  const [manage_pacientes, setManage_pacientes] = useState(false)
  const [manage_secretarias, setManage_secretarias] = useState(false)
  const [manage_aspirantes, setManage_aspirantes] = useState(false)
  const [manage_descuentos, setManage_descuentos] = useState(false)

  const [tab_key, setTab_key] = useState('cero')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMedicos());
    dispatch(fetchPacientes());
    dispatch(fetchSecretarias());
    dispatch(fetchAspirantes());
    dispatch(fetchDiscounts());
  }, [dispatch]);

  return (
    <>
      <Header action="Cerrar Sesion" link="/" color="#EEEEED" />
      <div style={{ marginRight: '2rem' }}>
        <Tab.Container bg="dark" variant="dark" id="left-tabs-example" activeKey={tab_key}>
          <Row>
            <Col sm={3}>
              <div className="Bar" style={{ backgroundColor: '#EEEEED' }}>
                <Nav variant="pills" className="flex-column" style={{ marginLeft: '5px' }}>
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (tab_key === 'first' || (tab_key === 'first-2' && manage_medicos)) {
                          setTab_key('five')
                        }
                        setManage_medicos(!manage_medicos)
                      }}
                    >
                      🧑‍⚕️ Medicos{' '}
                      {manage_medicos ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_medicos ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="first"
                          onClick={() => setTab_key('first')}
                        >
                          🧔 Crear Medico
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="first-2"
                          onClick={() => setTab_key('first-2')}
                        >
                          📖 Listar Medicos
                        </Nav.Link>{' '}
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  {/********************************************************/}
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (
                          tab_key === 'second' ||
                          (tab_key === 'second-2' && manage_secretarias)
                        ) {
                          setTab_key('five')
                        }
                        setManage_secretarias(!manage_secretarias)
                      }}
                    >
                      👩‍💼 Secretarias{' '}
                      {manage_secretarias ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_secretarias ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="second"
                          onClick={() => setTab_key('second')}
                        >
                          👩‍🦰 Registrar Secretaria
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="second-2"
                          onClick={() => setTab_key('second-2')}
                        >
                          📔 Listar Secretarias
                        </Nav.Link>{' '}
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  {/********************************************************/}
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (tab_key === 'three' || (tab_key === 'three-2' && manage_pacientes)) {
                          setTab_key('five')
                        }
                        setManage_pacientes(!manage_pacientes)
                      }}
                    >
                      🧑‍🏫 Clientes{' '}
                      {manage_pacientes ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_pacientes ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          eventKey="three"
                          onClick={() => setTab_key('three')}
                        >
                          🚶🏻 Registrar Cliente
                        </Nav.Link>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          onClick={() => setTab_key('three-2')}
                          eventKey="three-2"
                        >
                          🐾 Listar Clientes
                        </Nav.Link>{' '}
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  {/********************************************************/}
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if (tab_key === 'four' && manage_aspirantes) {
                          setTab_key('five')
                        }
                        setManage_aspirantes(!manage_aspirantes)
                      }}
                    >
                      🙋 Aspirantes{' '}
                      {manage_aspirantes ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_aspirantes ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          onClick={() => setTab_key('four')}
                          eventKey="four"
                        >
                          👥 Listar Aspirantes
                        </Nav.Link>{' '}
                      </>
                    ) : (
                      <></>
                    )}
                  </Nav.Item>
                  {/********************************************************/}
                  <Nav.Item style={{ marginTop: '10px' }}>
                    <Nav.Link
                      style={{ fontSize: 22 }}
                      onClick={() => {
                        if ((tab_key === 'six' || tab_key === 'six-2') && manage_descuentos) {
                          setTab_key('five')
                        }
                        setManage_descuentos(!manage_descuentos)
                      }}
                    >
                      💰 Descuentos{' '}
                      {manage_descuentos ? (
                        <span style={{ fontSize: 16 }}>❌</span>
                      ) : (
                        <span style={{ fontSize: 16 }}>⬅️</span>
                      )}
                    </Nav.Link>
                    {manage_descuentos ? (
                      <>
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          onClick={() => setTab_key('six')}
                          eventKey="six"
                        >
                          📝 Crear Descuento
                        </Nav.Link>{' '}
                        <Nav.Link
                          style={{ marginLeft: '20px', fontSize: 20 }}
                          onClick={() => setTab_key('six-2')}
                          eventKey="six-2"
                        >
                          📑 Listar Descuentos
                        </Nav.Link>{' '}
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
                  <FormUser tipo="medico" />
                </Tab.Pane>
                <Tab.Pane eventKey="first-2">
                  <TableUser tipo="medico" users={medicos} />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <FormUser tipo="secretaria" />
                </Tab.Pane>
                <Tab.Pane eventKey="second-2">
                  <TableUser tipo="secretaria" users={secretarias} />
                </Tab.Pane>
                <Tab.Pane eventKey="three">
                  <FormUser tipo="paciente" />
                </Tab.Pane>
                <Tab.Pane eventKey="three-2">
                  <TableUser tipo="paciente" users={pacientes} />
                </Tab.Pane>
                <Tab.Pane eventKey="four">
                  <TableUser tipo="aspirante" users={aspirantes} />
                </Tab.Pane>
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
                <Tab.Pane eventKey="six">
                  <FormDiscount />
                </Tab.Pane>
                <Tab.Pane eventKey="six-2">
                  <TableDiscount discounts={discounts} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  )
}
