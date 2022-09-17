import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import '../styles/header.css'
import logo from '../assets/gatifu_hor_transparente.png'
import { useContext } from 'react'
import { AuthContext } from '../auth/context/AuthContext'

function Header({ action, link, color }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  return (
    <Navbar style={{ backgroundColor: color }} className="header" expand="md">
      <Container>
        <Navbar.Brand>
          <img src={logo} width="120" height="60" className="d-inline-block align-top img_header" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <NavDropdown title={`🤵‍♂️ ${user.name}`} id="basic-nav-dropdown">
              {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item> */}
              {/* <NavDropdown.Divider /> */}
              <NavDropdown.Item onClick={logout}>{action}</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
