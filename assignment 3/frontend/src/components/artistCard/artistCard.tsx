import { Card, Container, Row, Col } from "react-bootstrap";
import "./artistCard.css";

export default function ArtistCard({
  image,
  text,
  selected,
}: {
  image: string;
  text: string;
  selected: boolean;
}) {
  return (
    <Card className='artist-card border-0 shadow-sm'>
      <div className='image-container'>
        <Card.Img
          src={image}
          alt={`Artwork by ${text}`}
          className='artist-image'
          style={{ objectFit: "cover", borderRadius: "0 0 0 0" }}
        />
      </div>
      <Card.Footer className='py-3 text-white' style={{
        backgroundColor: `${selected ? "rgb(1, 68, 134)" : 
        "rgb(18, 37, 51)"}`
      }}>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <h4 className='artist-name mb-0'>{text}</h4>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}
