import { Spinner, Button, Container, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Artist from "../../types/artist";
import ArtistCard from "../artistCard/artistCard";
import artsyLogo from "../../assets/images/artsy_logo.svg";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [artists, setArtists] = useState<Artist[]>([]);

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

  return (
    <Container className='text-center'>
      <Form>
        <Form.Group
          className='mb-3 mt-5 w-75 d-inline-flex'
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
        <div className='mt-5'>
          <h3>Artists</h3>
          {artists.map((artist, index) => (
            <ArtistCard
              key={index}
              image={
                artist._links.thumbnail.href.includes("missing_image.png")
                  ? artsyLogo
                  : artist._links.thumbnail.href
              }
              text={artist.title}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
