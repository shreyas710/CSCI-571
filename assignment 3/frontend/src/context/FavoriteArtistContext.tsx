import { createContext, useState, useContext, ReactNode } from "react";
import FavoriteArtistData from "../types/favoriteArtistType";

interface FavoriteArtistContextType {
  favouriteArtists: FavoriteArtistData[] | undefined;
  setFavouriteArtists: (value: FavoriteArtistData[] | undefined) => void;
}

const FavoriteArtistsContext = createContext<
  FavoriteArtistContextType | undefined
>(undefined);

function FavoriteArtistsProvider({ children }: { children: ReactNode }) {
  const [favouriteArtists, setFavouriteArtists] = useState<
    FavoriteArtistData[] | undefined
  >([]);

  const value: FavoriteArtistContextType = {
    favouriteArtists,
    setFavouriteArtists,
  };

  return (
    <FavoriteArtistsContext.Provider value={value}>
      {children}
    </FavoriteArtistsContext.Provider>
  );
}

function useFavoriteArtists(): FavoriteArtistContextType {
  const context = useContext(FavoriteArtistsContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { FavoriteArtistsProvider, useFavoriteArtists };
