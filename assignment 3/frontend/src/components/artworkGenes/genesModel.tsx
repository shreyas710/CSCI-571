import { Modal, Spinner } from "react-bootstrap";
import Artwork from "../../types/artworkType";
import GeneCategory from "../../types/geneType";

export default function GenesModel({
  show,
  handleClose,
  artwork,
  thumbnailUrl,
  loader,
  genes,
}: {
  show: boolean;
  handleClose: () => void;
  artwork: Artwork;
  thumbnailUrl: string;
  loader: boolean;
  genes: GeneCategory[];
}) {
  return (
    <Modal size='lg' show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <img src={thumbnailUrl} alt='artwork image' height={"70px"} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}>
          <Modal.Title className='fs-6'>{artwork.title}</Modal.Title>
          <Modal.Title className='fs-6'>{artwork.date}</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body>
        {loader ? (
          <div className='d-flex justify-content-center'>
            <Spinner
              style={{
                color: "rgb(1, 68, 134)",
                width: "50px",
                height: "50px",
              }}
              animation='border'
              role='status'
              className='mt-5'
            />
          </div>
        ) : (
          <div>
            <h5>Genes</h5>
            <div className='d-flex flex-wrap'>
              {genes.map((gene) => (
                <div
                  key={gene.id}
                  className='card m-2'
                  style={{ width: "10rem" }}>
                  <img
                    src={gene._links.thumbnail.href}
                    alt={gene.name}
                    className='card-img-top'
                    style={{ objectFit: "cover" }}
                  />
                  <div className='card-body'>
                    <h5 className='card-title'>{gene.display_name}</h5>
                    <p className='card-text'>{gene.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
