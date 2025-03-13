// import { useState } from "react";
import { Star, StarFill } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthContext";
// import { useNotifications } from "../../context/NotificationContext";
import SelectedArtist from "../../types/selectedArtistType";
import { useState } from "react";

export default function ArtistDetails({ artist }: { artist: SelectedArtist }) {
  const paragraphs = artist.biography.split("\n\n");

  const { isLoggedIn } = useAuth();
  // const { notifications, setNotifications } = useNotifications();

  function combineSplitWords(text: string) {
    const splitWordRegex = /(\w+)-\s(\w+)/g;

    return text.replace(splitWordRegex, (firstPart, secondPart) => {
      return `${secondPart}${firstPart.split("- ")[1]}`;
    });
  }

  const [toggleFavorite, setToggleFavorite] = useState<boolean>(false);

  return (
    <div className='mt-3'>
      <div className='text-center'>
        <h2 className='font-bold m-0'>
          {artist.name}
          {isLoggedIn &&
            (toggleFavorite ? (
              <StarFill
                onClick={() => setToggleFavorite(!toggleFavorite)}
                className='ms-2 pb-1'
                style={{ color: "gold", cursor: "pointer" }}
                size={30}
              />
            ) : (
              <Star
                onClick={() => setToggleFavorite(!toggleFavorite)}
                className='ms-2 pb-1'
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
