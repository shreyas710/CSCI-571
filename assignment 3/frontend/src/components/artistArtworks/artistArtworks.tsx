import Artwork from "../../types/artworkType";

export default function ArtistArtworks({ artworks }: { artworks: Artwork[] }) {
  return artworks.map((artwork) => (
    <div key={artwork.id} className='mt-3'>
      <div className='text-center'>
        <h2 className='font-bold m-0'>{artwork.title}</h2>
        <p className='text-lg text-gray-600'>{artwork.date}</p>
      </div>
    </div>
  ));
}
