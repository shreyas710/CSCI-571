import { useEffect, useState } from "react";
import { useFavorites } from "../../context/FavoriteContext";
import Favorite from "./favorite";
import { Spinner } from "react-bootstrap";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useFavoriteArtists } from "../../context/FavoriteArtistContext";

export default function Favorites() {
  const navigate = useNavigate();

  const { favorites } = useFavorites();

  const [loader, setLoader] = useState(true);

  const { favouriteArtists, setFavouriteArtists } = useFavoriteArtists();

  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    if (cookies.length > 0) {
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split("=");
        if (key.trim() === "userToken") {
          setUserToken(value);
        }
      });
    }

    if (!favorites.length) {
      setLoader(false);
      return;
    }

    const fetchFavorites = async () => {
      for (const favorite of favorites) {
        try {
          const response = await fetch(`/api/artsy/get_artist/${favorite.id}`);
          const data = await response.json();
          // @ts-expect-error favouriteArtists is of any type
          setFavouriteArtists((favouriteArtists) => [
            {
              artistDetails: data,
              favoriteDetails: favorite,
            },
            ...favouriteArtists!,
          ]);
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(error);
        }
      }
      setLoader(false);
    };

    if (favouriteArtists == undefined || !favouriteArtists.length) {
      fetchFavorites();
      return;
    }
    setLoader(false);
  }, []);

  const handleFavoriteClick = (artistId: string) => {
    navigate({
      pathname: "/",
      search: `?${createSearchParams({
        artistId,
      })}`,
    });
  };

  if (loader) {
    return (
      <div className='text-center'>
        <Spinner
          style={{ color: "rgb(1, 68, 134)", width: "50px", height: "50px" }}
          animation='border'
          role='status'
          className='mt-5'
        />
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className='container mt-5'>
        <div className='alert alert-danger text-lg-start mt-3' role='alert'>
          No favorite artists.
        </div>
      </div>
    );
  }

  return (
    <div
      className='container mt-5'
      style={{ maxWidth: "75%", marginBottom: "50px" }}>
      {favouriteArtists!.map((artist) => (
        <Favorite
          key={artist.favoriteDetails.id}
          favoriteArtistData={artist}
          userToken={userToken}
          handleFavoriteClick={handleFavoriteClick}
        />
      ))}
    </div>
  );
}
