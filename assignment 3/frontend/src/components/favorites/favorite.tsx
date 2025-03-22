import FavoriteArtistData from "../../types/favoriteArtistType";
import { Card } from "react-bootstrap";
import artsyLogo from "../../assets/images/artsy_logo.svg";
import { useFavorites } from "../../context/FavoriteContext";
import { useEffect, useState } from "react";
import { useFavoriteArtists } from "../../context/FavoriteArtistContext";

export default function Favorite({
  favoriteArtistData,
  userToken,
  handleFavoriteClick,
}: {
  favoriteArtistData: FavoriteArtistData;
  userToken: string | null;
  handleFavoriteClick: (id: string) => void;
}) {
  const { favoriteDetails, artistDetails } = favoriteArtistData;
  const { favorites, setFavorites } = useFavorites();

  const [timeAgo, setTimeAgo] = useState(
    favoriteDetails.createdAt
      ? formatTimeAgo(new Date(favoriteDetails.createdAt))
      : ""
  );

  const { favouriteArtists, setFavouriteArtists } = useFavoriteArtists();

  function formatTimeAgo(createdDate: Date) {
    const seconds = Math.floor(
      (new Date().getTime() - createdDate.getTime()) / 1000
    );

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  useEffect(() => {
    if (!favoriteDetails.createdAt) return;

    const timer = setInterval(() => {
      setTimeAgo(formatTimeAgo(new Date(favoriteDetails.createdAt)));
    }, 1000);

    return () => clearInterval(timer);
  }, [favoriteDetails.createdAt]);

  const removeFavoriteFromUser = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/users/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ id: favoriteDetails.id }),
      });
      const data = await response.json();
      setFavorites(
        favorites.filter((favorite) => favorite.id !== favoriteDetails.id)
      );
      setFavouriteArtists(
        favouriteArtists?.filter(
          (artist) => artist.favoriteDetails.id !== favoriteDetails.id
        ) || []
      );
      console.log("Remove favorite response:", data);
    } catch (error) {
      console.error("Remove favorite failed:", error);
    }
  };

  return (
    <Card
      onClick={() => handleFavoriteClick(artistDetails.id)}
      style={{
        display: "inline-block",
        width: "350px",
        height: "200px",
        margin: "10px",
        borderRadius: "8px",
        overflow: "hidden", // This is critical to contain the blur
        position: "relative", // Needed for absolute positioning of children
        cursor: "pointer",
      }}>
      <Card.Img
        src={
          !artistDetails._links ||
          !artistDetails._links.thumbnail ||
          !artistDetails._links.thumbnail.href ||
          artistDetails._links.thumbnail.href.includes("missing_image.png")
            ? artsyLogo
            : artistDetails._links.thumbnail.href
        }
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          filter: "blur(5px)",
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />
      <Card.Body
        className='p-3'
        style={{
          height: "100%",
          position: "relative",
          zIndex: 2,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}>
        <Card.Title className='mb-2 fs-4 fw-bold'>
          {artistDetails.name}
        </Card.Title>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}>
          <Card.Text className='mb-0 me-1 small' style={{ opacity: 0.9 }}>
            {artistDetails.birthday} - {artistDetails.deathday}
          </Card.Text>
          <Card.Text className='mb-0 small' style={{ opacity: 0.9 }}>
            {artistDetails.nationality}
          </Card.Text>
        </div>
        <div className='d-flex justify-content-between align-items-center mt-auto'>
          <Card.Text className='mb-0' style={{ opacity: 0.8 }}>
            {timeAgo}
          </Card.Text>
          <button
            className='btn btn-link text-white text-decoration-none p-0'
            onClick={(e) => removeFavoriteFromUser(e)}>
            <u>Remove</u>
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}
