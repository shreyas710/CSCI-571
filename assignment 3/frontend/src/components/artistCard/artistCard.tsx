import { Card, Container, Row, Col } from "react-bootstrap";
import "./artistCard.css";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Star, StarFill } from "react-bootstrap-icons";
import { useFavorites } from "../../context/FavoriteContext";
import { useNotifications } from "../../context/NotificationContext";

export default function ArtistCard({
  image,
  text,
  selected,
  hovered,
  id,
}: {
  image: string;
  text: string;
  selected: boolean;
  hovered: boolean;
  id: string;
}) {
  const { isLoggedIn } = useAuth();
  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);

  const { favorites, setFavorites } = useFavorites();

  const { notifications, setNotifications } = useNotifications();

  useEffect(() => {
    if (favorites.includes(id)) {
      setToggleFavorite(true);
    } else {
      setToggleFavorite(false);
    }
  }, [favorites, id]);

  const handleClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (toggleFavorite) {
      setNotifications([
        ...notifications,
        {
          message: `Removed from favorites`,
          textColor: "text-danger",
          backgroundColor: "rgb(249, 210, 214)",
          show: true,
        },
      ]);
      setFavorites(favorites.filter((favorite) => favorite !== id));
    } else {
      setNotifications([
        ...notifications,
        {
          message: `Added to favorites`,
          textColor: "text-success",
          backgroundColor: "rgb(214, 249, 210)",
          show: true,
        },
      ]);
      setFavorites([...favorites, id]);
    }
    setToggleFavorite(!toggleFavorite);
  };

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
      {isLoggedIn && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 10,
            right: 10,
            borderRadius: "50%",
            backgroundColor: "rgb(14, 67, 134)",
            width: 35,
            height: 35,
          }}>
          {toggleFavorite ? (
            <StarFill
              onClick={(e) => handleClick(e)}
              className='pt-1'
              style={{
                color: "gold",
                cursor: "pointer",
              }}
              size={25}
            />
          ) : (
            <Star
              onClick={(e) => handleClick(e)}
              className='pt-1'
              style={{
                color: "white",
                cursor: "pointer",
              }}
              size={25}
            />
          )}
        </div>
      )}

      <Card.Footer
        className='card-footer py-3 text-white'
        style={{
          backgroundColor: `${
            selected || hovered ? "rgb(1, 68, 134)" : "rgb(18, 37, 51)"
          }`,
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
