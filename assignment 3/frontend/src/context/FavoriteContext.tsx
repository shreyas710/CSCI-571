import { createContext, useState, useContext, ReactNode } from "react";

interface FavoriteContextType {
  favorites: string[];
  setFavorites: (value: string[]) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const value: FavoriteContextType = {
    favorites,
    setFavorites,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

function useFavorites(): FavoriteContextType {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { FavoritesProvider, useFavorites };
