import { Star, StarFill } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import SelectedArtist from "../../types/selectedArtistType";
import { useEffect, useState } from "react";
import { useFavorites } from "../../context/FavoriteContext";

export default function ArtistDetails({ artist }: { artist: SelectedArtist }) {
  const paragraphs = artist.biography.split("\n\n");

  const { isLoggedIn } = useAuth();
  const { notifications, setNotifications } = useNotifications();

  const { favorites, setFavorites } = useFavorites();

  function combineSplitWords(text: string) {
    const splitWordRegex = /(\w+)-\s(\w+)/g;

    return text.replace(splitWordRegex, (firstPart, secondPart) => {
      return `${secondPart}${firstPart.split("- ")[1]}`;
    });
  }

  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (favorites.includes(artist.id)) {
      setToggleFavorite(true);
    } else {
      setToggleFavorite(false);
    }
  }, [favorites, artist.id]);

  const handleClick = () => {
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
      setFavorites(favorites.filter((favorite) => favorite !== artist.id));
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
      setFavorites([...favorites, artist.id]);
    }
    setToggleFavorite(!toggleFavorite);
  };

  return (
    <div className='mt-3'>
      <div className='text-center'>
        <h2 className='font-bold m-0'>
          {artist.name}
          {isLoggedIn &&
            (toggleFavorite ? (
              <StarFill
                onClick={handleClick}
                className='ms-1 pb-2'
                style={{ color: "gold", cursor: "pointer" }}
                size={30}
              />
            ) : (
              <Star
                onClick={handleClick}
                className='ms-1 pb-2'
                style={{
                  cursor: "pointer",
                }}
                size={30}
              />
            ))}
        </h2>
        <p className='text-lg text-gray-600'>
          {artist.nationality}, {artist.birthday} - {artist.deathday}
        </p>
      </div>
      <div
        className='mt-3'
        style={{ margin: "0 auto 0 auto", textAlign: "justify" }}>
        {paragraphs.map((paragraph, index) => {
          return <p key={index}>{combineSplitWords(paragraph)}</p>;
        })}
      </div>
    </div>
  );
}
