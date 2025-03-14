import { createContext, useState, useContext, ReactNode } from "react";

interface FavoriteContextType {
  favorites: { id: string; createdAt: Date }[];
  setFavorites: (value: { id: string; createdAt: Date }[]) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<{ id: string; createdAt: Date }[]>(
    []
  );

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
