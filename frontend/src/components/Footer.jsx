import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "../styles/footer.css";

function Footer() {
  return (
    <Navbar  className="footer" fixed="bottom">
      <Container>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Text>
            © {new Date().getFullYear()} GATIFU
            <br />
            Analisis y diseño de sistemas 2
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Footer;
