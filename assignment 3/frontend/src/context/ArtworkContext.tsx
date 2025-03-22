import { createContext, useState, useContext, ReactNode } from "react";
import Artwork from "../types/artworkType";

interface ArtworkContextType {
  artworks: Artwork[];
  setArtworks: (value: Artwork[]) => void;
}

const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

function ArtworksProvider({ children }: { children: ReactNode }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  const value: ArtworkContextType = {
    artworks,
    setArtworks,
  };

  return (
    <ArtworkContext.Provider value={value}>{children}</ArtworkContext.Provider>
  );
}

function useArtworks(): ArtworkContextType {
  const context = useContext(ArtworkContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { ArtworksProvider, useArtworks };
