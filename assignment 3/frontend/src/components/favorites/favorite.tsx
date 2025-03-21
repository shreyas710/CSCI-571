import FavoriteArtistData from "../../types/favoriteArtistType";
import { Card } from "react-bootstrap";
import artsyLogo from "../../assets/images/artsy_logo.svg";
import { useFavorites } from "../../context/FavoriteContext";

export default function Favorite({
  favoriteArtistData,
  userToken,
  artists,
  setArtists,
}: {
  favoriteArtistData: FavoriteArtistData;
  userToken: string | null;
  artists: FavoriteArtistData[] | null;
  setArtists: React.Dispatch<React.SetStateAction<FavoriteArtistData[] | null>>;
}) {
  const { favoriteDetails, artistDetails } = favoriteArtistData;
  const { favorites, setFavorites } = useFavorites();

  const removeFavoriteFromUser = async () => {
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
      setArtists(
        artists?.filter(
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
      style={{
        maxWidth: "300px",
        borderRadius: "8px",
        backgroundImage: `url(${
          !artistDetails._links ||
          !artistDetails._links.thumbnail ||
          !artistDetails._links.thumbnail.href ||
          artistDetails._links.thumbnail.href.includes("missing_image.png")
            ? artsyLogo
            : artistDetails._links.thumbnail.href
        })`,
      }}
      className='m-auto'>
      <Card.Body className='p-3'>
        <div className='d-flex justify-content-between align-items-start'>
          <div>
            <Card.Title className='mb-0 fs-5 fw-bold'>
              {artistDetails.name}
            </Card.Title>
            <Card.Text className='text-muted small mb-1'>
              {artistDetails.birthday} - {artistDetails.deathday}
            </Card.Text>
            <Card.Text className='text-muted small mb-0'>
              {artistDetails.nationality}
            </Card.Text>
          </div>
          <button
            className='btn btn-link text-white text-decoration-none p-0 small'
            onClick={removeFavoriteFromUser}>
            Remove
          </button>
        </div>
        <Card.Text className='text-muted small mt-2 mb-0'>
          {favoriteDetails.id}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
