import Artwork from "../../types/artworkType";
import ArtworkCard from "./artwork";

export default function ArtistArtworks({ artworks }: { artworks: Artwork[] }) {
  return (
    <div className="mt-5" style={{textAlign: "left", display: "flex", flexWrap: "wrap", alignItems: "start"}}>
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
