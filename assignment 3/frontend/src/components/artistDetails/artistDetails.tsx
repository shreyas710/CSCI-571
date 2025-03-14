import { useAuth } from "../../context/AuthContext";
import SelectedArtist from "../../types/selectedArtistType";
import { useState } from "react";
import StarElement from "../starComponent/starElement";

export default function ArtistDetails({
  artist,
  userToken,
}: {
  userToken: string | null;
  artist: SelectedArtist;
}) {
  const paragraphs = artist.biography.split("\n\n");

  const { isLoggedIn } = useAuth();

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
          {isLoggedIn && (
            <StarElement
              toggleFavorite={toggleFavorite}
              userToken={userToken}
              id={artist.id}
              setToggleFavorite={setToggleFavorite}
              isCard={false}
            />
          )}
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
