import { Spinner, Button, Container, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Artist from "../../types/artist";
import SelectedArtist from "../../types/selectedArtist";
import ArtistCard from "../artistCard/artistCard";
import artsyLogo from "../../assets/images/artsy_logo.svg";
import "./home.css";
import ArtistDetails from "../artistDetails/artistDetails";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [card, setCard] = useState<Artist | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );

  const [fetchArtistLoader, setFetchArtistLoader] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/artsy");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/artsy/search_artist/${search}`);
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchArtist(artist: Artist) {
    setCard(artist);
    setSelectedArtist(null);
    setFetchArtistLoader(true);
    try {
      const response = await fetch(
        `/api/artsy/get_artist/${
          artist._links.self.href.split("/")[
            artist._links.self.href.split("/").length - 1
          ]
        }`
      );
      const data = await response.json();
      setSelectedArtist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchArtistLoader(false);
    }
  }

  return (
    <Container className='text-center'>
      <Form>
        <Form.Group
          className='mt-5 w-100 d-inline-flex'
          controlId='exampleForm.ControlInput1'>
          <Form.Control
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Please enter an artist name.'
          />
          <Button
            variant='primary'
            disabled={search == "" ? true : false}
            type='submit'
            style={{ borderRadius: 0, backgroundColor: "rgb(0, 66, 133)" }}
            onClick={(e) => handleSubmit(e)}>
            <span style={{ display: "flex", alignItems: "center" }}>
              Submit
              {loading && <Spinner size='sm' className='ms-2' />}
            </span>
          </Button>
          <Button
            variant='secondary'
            disabled={search == "" ? true : false}
            onClick={() => setSearch("")}
            style={{ borderRadius: "0 5px 5px 0" }}>
            Clear
          </Button>
        </Form.Group>
      </Form>

      {artists.length > 0 && (
        <div
          className='mt-3 overflow-auto home-artist-card'
          style={{ whiteSpace: "nowrap" }}>
          {artists.map((artist, index) => (
            <div
              onClick={() => fetchArtist(artist)}
              key={index}
              className='d-inline-block me-3'>
              <ArtistCard
                selected={card === artist}
                image={
                  artist._links.thumbnail.href.includes("missing_image.png")
                    ? artsyLogo
                    : artist._links.thumbnail.href
                }
                text={artist.title}
              />
            </div>
          ))}
        </div>
      )}

      {fetchArtistLoader && (
        <Spinner
          style={{ color: "rgb(1, 68, 134)" }}
          animation='border'
          role='status'
          className='mt-5'
        />
      )}

      {selectedArtist && (
        <Tabs defaultActiveKey='info' className='mt-5'>
          <Tab eventKey='info' title='Artist Info'>
            <ArtistDetails artist={selectedArtist} />
          </Tab>
          <Tab eventKey='artworks' title='Artworks'>
            <ArtistDetails artist={selectedArtist} />
          </Tab>
        </Tabs>
      )}
    </Container>
  );
}
