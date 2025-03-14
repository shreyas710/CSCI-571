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
  userToken,
}: {
  image: string;
  text: string;
  selected: boolean;
  hovered: boolean;
  id: string;
  userToken: string | null;
}) {
  const { isLoggedIn } = useAuth();
  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);

  const { favorites, setFavorites } = useFavorites();

  const { notifications, setNotifications } = useNotifications();

  useEffect(() => {
    if (favorites.some((favorite) => favorite.id === id)) {
      setToggleFavorite(true);
    } else {
      setToggleFavorite(false);
    }
  }, [favorites, id]);

  const addfavoritesToUser = async () => {
    try {
      const response = await fetch(`/api/users/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Add favorite failed:", error);
    }
  };

  const removeFavoriteFromUser = async () => {
    try {
      const response = await fetch(`/api/users/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      console.log("Remove favorite response:", data);
    } catch (error) {
      console.error("Remove favorite failed:", error);
    }
  };

  const handleClick = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (toggleFavorite) {
      await removeFavoriteFromUser();
      setNotifications([
        ...notifications,
        {
          message: `Removed from favorites`,
          textColor: "text-danger",
          backgroundColor: "rgb(249, 210, 214)",
          show: true,
        },
      ]);
      setFavorites(favorites.filter((favorite) => favorite.id !== id));
    } else {
      const data = await addfavoritesToUser();
      setNotifications([
        ...notifications,
        {
          message: `Added to favorites`,
          textColor: "text-success",
          backgroundColor: "rgb(214, 249, 210)",
          show: true,
        },
      ]);
      setFavorites([...favorites, data]);
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
