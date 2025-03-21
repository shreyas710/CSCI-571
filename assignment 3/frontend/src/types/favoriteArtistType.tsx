import SelectedArtist from "./selectedArtistType";

interface FavoriteArtistData {
  artistDetails: SelectedArtist;
  favoriteDetails: { id: string; createdAt: Date };
}

export default FavoriteArtistData;
