import SelectedArtist from "../../types/selectedArtist";

export default function ArtistDetails({ artist }: { artist: SelectedArtist }) {
    return (
      <div className='mt-5'>
        <h1>{artist.name}</h1>
        <p>{artist.biography}</p>
      </div>
    );
}