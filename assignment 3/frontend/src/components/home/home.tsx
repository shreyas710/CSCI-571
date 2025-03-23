import { Spinner, Button, Container, Form, Nav, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Artist from "../../types/artistType";
import SelectedArtist from "../../types/selectedArtistType";
import ArtistCard from "../artistCard/artistCard";
import artsyLogo from "../../assets/images/artsy_logo.svg";
import "./home.css";
import ArtistDetails from "../artistDetails/artistDetails";
import Tab from "react-bootstrap/Tab";
import ArtistArtworks from "../artistArtworks/artistArtworks";
import { useAuth } from "../../context/AuthContext";
import StackingExample from "../notifications/notifications";
import { useNotifications } from "../../context/NotificationContext";
import { useFavorites } from "../../context/FavoriteContext";
import { useSearchParams } from "react-router-dom";
import { useArtworks } from "../../context/ArtworkContext";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [artists, setArtists] = useState<Artist[]>([]);
  const [similarArtists, setSimilarArtists] = useState<Artist[]>([]);
  const [card, setCard] = useState<Artist | null>(null);

  const [selectedArtist, setSelectedArtist] = useState<SelectedArtist | null>(
    null
  );

  const { artworks, setArtworks } = useArtworks();

  const [fetchArtworksLoader, setFetchArtworksLoader] =
    useState<boolean>(false);

  const [fetchArtistLoader, setFetchArtistLoader] = useState<boolean>(false);

  const [userToken, setUserToken] = useState<string | null>(null);
  const [artsyToken, setArtsyToken] = useState<string | null>(null);

  const [hoveredCard, setHoveredCard] = useState<Artist | null>(null);

  const [alert, setAlert] = useState<string | null>(null);
  const [artworkAlert, setArtworkAlert] = useState<string | null>(null);

  const { notifications } = useNotifications();

  const { setFavorites } = useFavorites();

  const { isLoggedIn, login, setUser } = useAuth();

  const [searchParams] = useSearchParams();
  const artistId = searchParams.get("artistId");

  useEffect(() => {
    if (artistId) {
      setSelectedArtist(null);
      setArtworks([]);

      const fetchArtistById = async () => {
        try {
          const response = await fetch(`/api/artsy/get_artist/${artistId}`);
          const data = await response.json();
          setSelectedArtist(data);
          localStorage.setItem("selectedArtist", JSON.stringify(data));
        } catch (error) {
          console.error(error);
        } finally {
          setFetchArtistLoader(false);
        }
      };

      setFetchArtistLoader(true);
      fetchArtistById();
    }

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

    const selectedArtist = localStorage.getItem("selectedArtist");
    if (selectedArtist) {
      setSelectedArtist(JSON.parse(selectedArtist));
    }

    const fetchToken = async () => {
      try {
        const response = await fetch("/api/artsy");
        if (!response.ok) {
          throw new Error(`Error getting artsy token: ${response.status}`);
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
        if (response.status === 401) {
          return;
        }
        const data = await response.json();
        if (data) {
          login();
          setUser(data);
          setFavorites(data.favorites);
        }
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
    setArtworkAlert(null);
    setAlert(null);
    setSelectedArtist(null);
    setSimilarArtists([]);
    setArtworks([]);
    localStorage.clear();
    try {
      const response = await fetch(`/api/artsy/search_artist/${search}`);
      const data = await response.json();
      if (data.length === 0) {
        setAlert("No artists.");
      }
      setArtists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchArtist(artist: Artist, similarCard: boolean) {
    setCard(artist);
    setSelectedArtist(null);
    setFetchArtistLoader(true);
    setArtworkAlert(null);
    setArtworks([]);
    if (!similarCard) setSimilarArtists([]);
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
      localStorage.setItem("selectedArtist", JSON.stringify(data));

      if (isLoggedIn && !similarCard) {
        const responseSimilar = await fetch(
          `/api/artsy/get_similar_artists/${
            artist._links.self.href.split("/")[
              artist._links.self.href.split("/").length - 1
            ]
          }`
        );
        const dataSimilar = await responseSimilar.json();
        setSimilarArtists(dataSimilar);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchArtistLoader(false);
    }
  }

  async function fetchArtworks() {
    setFetchArtworksLoader(true);
    setArtworkAlert(null);
    try {
      const response = await fetch(
        `/api/artsy/get_artist_artworks/${selectedArtist!.id}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setArtworkAlert("No artworks.");
      }
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
            onClick={() => {
              setArtists([]);
              setSelectedArtist(null);
              setCard(null);
              setArtworks([]);
              setSearch("");
              setAlert(null);
              setAlert(null);
              setArtworkAlert(null);
              setSimilarArtists([]);
            }}
            style={{ borderRadius: "0 5px 5px 0" }}>
            Clear
          </Button>
        </Form.Group>
      </Form>

      {artists.length > 0 && (
        <div
          className='mt-3 overflow-auto home-artist-card'
          style={{ whiteSpace: "nowrap", textAlign: "left" }}>
          {artists.map((artist, index) => (
            <div
              onMouseEnter={() => setHoveredCard(artist)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => fetchArtist(artist, false)}
              key={index}
              className='d-inline-block me-3'>
              <ArtistCard
                userToken={userToken}
                hovered={hoveredCard === artist}
                selected={card === artist}
                image={
                  artist._links.thumbnail.href.includes("missing_image.png")
                    ? artsyLogo
                    : artist._links.thumbnail.href
                }
                text={artist.title}
                id={
                  artist._links.self.href.split("/")[
                    artist._links.self.href.split("/").length - 1
                  ]
                }
              />
            </div>
          ))}
        </div>
      )}
      {alert && (
        <div className='alert alert-danger text-lg-start mt-3' role='alert'>
          {alert}
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
              <Nav.Item
                onClick={() => setArtworkAlert(null)}
                style={{ width: "49%" }}>
                <Nav.Link eventKey='first'>Artist Info</Nav.Link>
              </Nav.Item>
              <Nav.Item style={{ width: "49%" }}>
                <Nav.Link
                  eventKey='second'
                  onClick={() => {
                    if (artworks.length === 0) {
                      fetchArtworks();
                    }
                  }}>
                  Artworks
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
          <Row>
            <Tab.Content>
              <Tab.Pane eventKey='first'>
                <ArtistDetails userToken={userToken} artist={selectedArtist} />
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
              {artworkAlert && (
                <div
                  className='alert alert-danger text-lg-start mt-3'
                  role='alert'>
                  {artworkAlert}
                </div>
              )}
            </Tab.Content>
          </Row>
        </Tab.Container>
      )}

      {isLoggedIn && similarArtists.length > 0 && (
        <div style={{ textAlign: "left" }}>
          <h3 className='text-start'>Similar Artists</h3>
          <div
            className='mt-3 overflow-auto home-artist-card'
            style={{ whiteSpace: "nowrap" }}>
            {similarArtists.map((artist, index) => (
              <div
                onMouseEnter={() => setHoveredCard(artist)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => fetchArtist(artist, true)}
                key={index}
                className='d-inline-block me-3'>
                <ArtistCard
                  userToken={userToken}
                  hovered={hoveredCard === artist}
                  selected={card === artist}
                  image={
                    artist._links.thumbnail.href.includes("missing_image.png")
                      ? artsyLogo
                      : artist._links.thumbnail.href
                  }
                  text={artist.name == undefined ? "" : artist.name}
                  id={artist.id == undefined ? "" : artist.id}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "10px",
          width: "300px",
          zIndex: 100,
        }}>
        <StackingExample notifications={notifications} />
      </div>
    </Container>
  );
}
