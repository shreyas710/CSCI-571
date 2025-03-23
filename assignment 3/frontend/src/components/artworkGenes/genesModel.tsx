import { Modal, Spinner } from "react-bootstrap";
import Artwork from "../../types/artworkType";
import GeneCategory from "../../types/geneType";
import "./genes.css";

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
    <Modal size='xl' show={show} onHide={handleClose} centered>
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
        ) : genes.length == 0 ? (
          <div className='alert alert-danger text-lg-start mt-3' role='alert'>
            No categories.
          </div>
        ) : (
          <div>
            <div className='d-flex flex-wrap'>
              {genes.map((gene) => (
                <div
                  key={gene.id}
                  className='card m-2 geneCard'
                  style={{ width: "250px", height: "300px" }}>
                  <img
                    src={gene._links.thumbnail.href}
                    alt={gene.name}
                    className='card-img-top'
                    style={{
                      objectFit: "cover",
                      height: "85%",
                      width: "100%",
                    }}
                  />
                  <div className='card-body' style={{ margin: "auto" }}>
                    <p className='card-text'>{gene.name}</p>
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
