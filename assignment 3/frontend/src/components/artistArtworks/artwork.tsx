import { Card } from "react-bootstrap";
import Artwork from "../../types/artworkType";
import artsyLogo from "../../assets/images/artsy_logo.svg";
import "./artwork.css";
import { useState } from "react";
import GenesModel from "../artworkGenes/genesModel";
import GeneCategory from "../../types/geneType";

const ArtworkCard = ({ artwork }: { artwork: Artwork }) => {
  let thumbnailUrl;
  const [loader, setLoader] = useState(true);
  const [genes, setGenes] = useState<GeneCategory[]>([]);

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

  const [show, setShow] = useState(false);

  const fetchGenes = async () => {
    try {
      const response = await fetch(`/api/artsy/get_artist_genes/${artwork.id}`);
      const data = await response.json();
      setGenes(data);
    } catch (error) {
      console.error(error);
    }
    setLoader(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);
    await fetchGenes();
  };

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
        className='text-muted cardFooter'
        style={{ cursor: "pointer", textAlign: "center" }}
        onClick={handleShow}>
        <small>View Categories</small>
      </Card.Footer>
      <GenesModel
        show={show}
        handleClose={handleClose}
        artwork={artwork}
        thumbnailUrl={thumbnailUrl}
        loader={loader}
        genes={genes}
      />
    </Card>
  );
};

export default ArtworkCard;
