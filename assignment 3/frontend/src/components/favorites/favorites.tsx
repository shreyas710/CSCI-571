// TODO 1: Set order of favorites in form of newset first
// TODO 2: Clicking on favorite artist should redirect to artist page

import { useEffect, useState } from "react";
import { useFavorites } from "../../context/FavoriteContext";
import Favorite from "./favorite";
import { Spinner } from "react-bootstrap";
import FavoriteArtistData from "../../types/favoriteArtistType";

export default function Favorites() {
  const { favorites } = useFavorites();

  const [loader, setLoader] = useState(true);
  const [artists, setArtists] = useState<FavoriteArtistData[] | undefined>([]);

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
      setArtists([]);
      for (const favorite of favorites) {
        try {
          const response = await fetch(`/api/artsy/get_artist/${favorite.id}`);
          const data = await response.json();
          setArtists((artists) =>
            artists
              ? [
                  ...artists,
                  {
                    artistDetails: data,
                    favoriteDetails: favorite,
                  },
                ]
              : [{ artistDetails: data, favoriteDetails: favorite }]
          );
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(error);
        }
      }
      setLoader(false);
    };

    fetchFavorites();
  }, []);

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

  if (!favorites.length || !artists) {
    return (
      <div className='container-fluid w-50 mt-5'>
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
      {artists.map((artist) => (
        <Favorite
          key={artist.favoriteDetails.id}
          favoriteArtistData={artist}
          userToken={userToken}
          artists={artists}
          setArtists={setArtists}
        />
      ))}
    </div>
  );
}
