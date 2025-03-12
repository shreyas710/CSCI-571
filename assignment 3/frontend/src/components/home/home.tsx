import { Spinner, Button, Container, Form, Nav, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Artist from "../../types/artistType";
import SelectedArtist from "../../types/selectedArtistType";
import ArtistCard from "../artistCard/artistCard";
import artsyLogo from "../../assets/images/artsy_logo.svg";
import "./home.css";
import ArtistDetails from "../artistDetails/artistDetails";
import Tab from "react-bootstrap/Tab";
import Artwork from "../../types/artworkType";
import ArtistArtworks from "../artistArtworks/artistArtworks";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [card, setCard] = useState<Artist | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [fetchArtworksLoader, setFetchArtworksLoader] =
    useState<boolean>(false);

  const [fetchArtistLoader, setFetchArtistLoader] = useState<boolean>(false);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [artsyToken, setArtsyToken] = useState<string | null>(null);

  const [hoveredCard, setHoveredCard] = useState<Artist | null>(null);

  const { login, setUser } = useAuth();

  useEffect(() => {
    const cookies = document.cookie.split(";");
    if (cookies.length > 0) {
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split("=");
        if (key.trim() === "userToken") {
          setUserToken(value);
        }
        if (key.trim() === "token") {
          setArtsyToken(value);
        }
      });
    }

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

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        login();
        setUser(data);
      } catch (e) {
        console.error(e);
      }
    };

    if (!artsyToken) {
      fetchToken();
    }
    if (userToken) {
      fetchUser();
    }
  }, [artsyToken, userToken]);

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
      console.log(data)
      setSelectedArtist(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchArtistLoader(false);
    }
  }

  async function fetchArtworks() {
    setArtworks([]);
    setFetchArtworksLoader(true);
    try {
      const response = await fetch(
        `/api/artsy/get_artist_artworks/${selectedArtist!.id}`
      );
      const data = await response.json();
      setArtworks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchArtworksLoader(false);
    }
  }

  return (
    <Container className='text-center' style={{ marginBottom: "50px" }}>
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
              onMouseEnter={() => setHoveredCard(artist)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => fetchArtist(artist)}
              key={index}
              className='d-inline-block me-3'>
              <ArtistCard
                hovered={hoveredCard === artist}
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
          style={{ color: "rgb(1, 68, 134)", width: "50px", height: "50px" }}
          animation='border'
          role='status'
          className='mt-5'
        />
      )}

      {selectedArtist && (
        <Tab.Container defaultActiveKey='first'>
          <Row className='mt-3'>
            <Nav
              variant='pills'
              className='flex-row align-items-center justify-content-evenly w-100 p-0'>
              <Nav.Item style={{ width: "49%" }}>
                <Nav.Link eventKey='first'>Artist Info</Nav.Link>
              </Nav.Item>
              <Nav.Item style={{ width: "49%" }}>
                <Nav.Link eventKey='second' onClick={() => fetchArtworks()}>
                  Artworks
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
          <Row>
            <Tab.Content>
              <Tab.Pane eventKey='first'>
                <ArtistDetails artist={selectedArtist} />
              </Tab.Pane>
              {artworks && (
                <Tab.Pane eventKey='second'>
                  {fetchArtworksLoader && (
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
                  )}
                  {!fetchArtworksLoader && (
                    <ArtistArtworks artworks={artworks} />
                  )}
                </Tab.Pane>
              )}
            </Tab.Content>
          </Row>
        </Tab.Container>
      )}
    </Container>
  );
}
