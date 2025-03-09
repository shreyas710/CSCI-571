import SelectedArtist from "../../types/selectedArtistType";

export default function ArtistDetails({ artist }: { artist: SelectedArtist }) {
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
        style={{ margin: "0 auto 50px auto", textAlign: "justify" }}>
        <p className='text-gray-800'>{artist.biography}</p>
      </div>
    </div>
  );
}
