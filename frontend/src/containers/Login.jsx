import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/esm/Container'
import AlertDismissible from '../components/Alert'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import '../styles/login.css'
import { useForm } from '../hooks/useForm'
import { useContext } from 'react'
import { AuthContext } from '../auth/context/AuthContext'

function Login() {
  const userInfo = {
    email: '',
    password: '',
  }
  const { login } = useContext(AuthContext)
  const { email, password, onInputChange, onResetForm } = useForm(userInfo)
  const [show, setShow] = useState(false)
  const imgGatifu = './assets/gatifu_hor_transparente.png'

  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }
  return (
    <>
      {/* <Header /> */}
      <Container className="d-flex justify-content-center align-items-center">
        <div className="background_wavy"></div>
      </Container>
      {/* <Header /> */}
      <Container
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card style={{ width: '50%', background: '' }}>
          <Card.Img variant="top" src={imgGatifu} />
          <Card.Body>
            {show && <AlertDismissible onHide={() => setShow(false)} message={message} />}
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel controlId="floatingInput" label="Usuario" className="mb-3">
                  <Form.Control
                    style={{ height: '50px' }}
                    name="email"
                    value={email}
                    onChange={onInputChange}
                    type="text"
                    placeholder="Ingrese su correo"
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <FloatingLabel controlId="floatingPassword" label="Contraseña">
                  <Form.Control
                    style={{ height: '50px' }}
                    name="password"
                    value={password}
                    onChange={onInputChange}
                    type="password"
                    placeholder="Ingrese su contraseña"
                  />
                </FloatingLabel>
              </Form.Group>
              <div
                style={{
                  marginTop: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  onClick={handleSubmit}
                  style={{ width: '100%', height: '50px', background: '#19b9cc', border: 'none' }}
                >
                  Iniciar Sesion
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      {/* <Footer /> */}
    </>
  )
}

export default Login
