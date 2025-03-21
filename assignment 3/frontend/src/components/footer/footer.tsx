import { Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import artsyLogo from "../../assets/images/artsy_logo.svg";

export default function Footer() {
  return (
    <Container fluid>
      <Row className='text-center footer-row' style={{ zIndex: 100 }}>
        <p className='footer-text'>
          <a className='artsy-link' href='https://www.artsy.net'>
            Powered by
            <img src={artsyLogo} alt='Artsy Logo' className='artsy-logo' />
            Artsy.
          </a>
        </p>
      </Row>
    </Container>
  );
}
