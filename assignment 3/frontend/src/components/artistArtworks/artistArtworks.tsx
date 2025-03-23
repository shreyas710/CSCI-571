import Artwork from "../../types/artworkType";
import ArtworkCard from "./artwork";
import './artwork.css'

export default function ArtistArtworks({ artworks }: { artworks: Artwork[] }) {
  return (
    <div
      className='mt-3 artworkList'
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "start",
      }}>
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
