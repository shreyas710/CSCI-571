import SelectedArtist from "../../types/selectedArtistType";

export default function ArtistDetails({ artist }: { artist: SelectedArtist }) {
  const paragraphs = artist.biography.split("\n\n");

  function combineSplitWords(text: string) {
    // The regex pattern you specified: word, hyphen, space, word
    const splitWordRegex = /(\w+)-\s(\w+)/g;

    // Replace matches by removing the hyphen and space between word parts
    return text.replace(splitWordRegex, (firstPart, secondPart) => {
      return `${secondPart}${firstPart.split("- ")[1]}`;
    });
  }

  return (
    <div className='mt-3'>
      <div className='text-center'>
        <h2 className='font-bold m-0'>{artist.name}</h2>
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
