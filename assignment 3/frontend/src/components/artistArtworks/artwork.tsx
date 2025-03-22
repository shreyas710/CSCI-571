import { Card } from "react-bootstrap";
import Artwork from "../../types/artworkType";
import artsyLogo from "../../assets/images/artsy_logo.svg";

const ArtworkCard = ({ artwork }: { artwork: Artwork }) => {
  let thumbnailUrl;

  if (
    !artwork._links ||
    !artwork._links.thumbnail ||
    !artwork._links.thumbnail.href ||
    artwork._links.thumbnail.href.includes("missing_image.png")
  ) {
    thumbnailUrl = artsyLogo;
  } else {
    thumbnailUrl = artwork._links.thumbnail.href;
  }

  return (
    <Card
      className='shadow-sm mb-4'
      style={{
        width: "304px",
        display: "inline-block",
        margin: "10px",
        top: "0",
      }}>
      <Card.Img
        variant='top'
        src={thumbnailUrl}
        alt={artwork.title}
        style={{ objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title style={{ textAlign: "center" }} className='fs-6'>
          {artwork.title}, {artwork.date}
        </Card.Title>
      </Card.Body>
      <Card.Footer
        className='text-muted'
        style={{ cursor: "pointer", textAlign: "center" }}>
        <small>View Categories</small>
      </Card.Footer>
    </Card>
  );
};

export default ArtworkCard;
